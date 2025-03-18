import { getComments } from "@/firebase/DatabaseService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock("@/firebase/config", () => ({
  db: {},
}));

describe("getComments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if event does not exist", async () => {
    const eventID = "non-existent-event";
    const mockEventRef = { id: eventID };

    (doc as jest.Mock).mockReturnValue(mockEventRef);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
      data: () => null,
    });

    await expect(getComments(eventID)).rejects.toThrow(
      `Event with ID ${eventID} not found`
    );
    expect(doc).toHaveBeenCalledWith(db, "events", eventID);
    expect(getDoc).toHaveBeenCalledWith(mockEventRef);
  });

  it("should return an empty array when event has no comments", async () => {
    const eventID = "event-with-no-comments";
    const mockEventRef = { id: eventID };
    const mockEventData = { comments: [] };

    (doc as jest.Mock).mockReturnValue(mockEventRef);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => mockEventData,
    });

    const result = await getComments(eventID);

    expect(result).toEqual([]);
    expect(doc).toHaveBeenCalledWith(db, "events", eventID);
    expect(getDoc).toHaveBeenCalledWith(mockEventRef);
  });

  it("should return an empty array when comments field is undefined", async () => {
    const eventID = "event-with-undefined-comments";
    const mockEventRef = { id: eventID };
    const mockEventData = {};

    (doc as jest.Mock).mockReturnValue(mockEventRef);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => mockEventData,
    });

    const result = await getComments(eventID);

    expect(result).toEqual([]);
    expect(doc).toHaveBeenCalledWith(db, "events", eventID);
    expect(getDoc).toHaveBeenCalledWith(mockEventRef);
  });

  it("should fetch and sort comments correctly", async () => {
    const eventID = "event-with-comments";
    const mockEventRef = { id: eventID };

    const mockCommentRef1 = { id: "comment-1" };
    const mockCommentRef2 = { id: "comment-2" };
    const mockCommentRef3 = { id: "comment-3" };

    const mockComment1 = { text: "First comment", time: { seconds: 1000 } };
    const mockComment2 = { text: "Second comment", time: { seconds: 3000 } };
    const mockComment3 = { text: "Third comment", time: { seconds: 2000 } };

    const mockEventData = {
      comments: [mockCommentRef1, mockCommentRef2, mockCommentRef3],
    };

    (doc as jest.Mock).mockImplementation((db, collection) => {
      if (collection === "events") return mockEventRef;
      return null;
    });

    (getDoc as jest.Mock).mockImplementation(async ref => {
      if (ref === mockEventRef) {
        return {
          exists: () => true,
          data: () => mockEventData,
        };
      } else if (ref === mockCommentRef1) {
        return {
          exists: () => true,
          data: () => mockComment1,
        };
      } else if (ref === mockCommentRef2) {
        return {
          exists: () => true,
          data: () => mockComment2,
        };
      } else if (ref === mockCommentRef3) {
        return {
          exists: () => true,
          data: () => mockComment3,
        };
      }
      return {
        exists: () => false,
        data: () => null,
      };
    });

    const result = await getComments(eventID);

    expect(result).toEqual([mockComment2, mockComment3, mockComment1]);
    expect(doc).toHaveBeenCalledWith(db, "events", eventID);
    expect(getDoc).toHaveBeenCalledTimes(4);
  });

  it("should skip non-existent comments", async () => {
    const eventID = "event-with-missing-comment";
    const mockEventRef = { id: eventID };

    const mockCommentRef1 = { id: "comment-1" };
    const mockCommentRef2 = { id: "comment-missing" };

    const mockComment1 = { text: "Existing comment", time: { seconds: 1000 } };

    const mockEventData = {
      comments: [mockCommentRef1, mockCommentRef2],
    };

    (doc as jest.Mock).mockImplementation((db, collection) => {
      if (collection === "events") return mockEventRef;
      return null;
    });

    (getDoc as jest.Mock).mockImplementation(async ref => {
      if (ref === mockEventRef) {
        return {
          exists: () => true,
          data: () => mockEventData,
        };
      } else if (ref === mockCommentRef1) {
        return {
          exists: () => true,
          data: () => mockComment1,
        };
      } else if (ref === mockCommentRef2) {
        return {
          exists: () => false,
          data: () => null,
        };
      }
      return {
        exists: () => false,
        data: () => null,
      };
    });

    const result = await getComments(eventID);

    expect(result).toEqual([mockComment1]);
    expect(doc).toHaveBeenCalledWith(db, "events", eventID);
    expect(getDoc).toHaveBeenCalledTimes(3);
  });

  it("should propagate errors", async () => {
    const eventID = "event-with-error";
    const mockEventRef = { id: eventID };
    const mockError = new Error("Database error");

    (doc as jest.Mock).mockReturnValue(mockEventRef);
    (getDoc as jest.Mock).mockRejectedValue(mockError);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await expect(getComments(eventID)).rejects.toThrow(mockError);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error getting comments:",
      mockError
    );

    consoleErrorSpy.mockRestore();
  });
});
