import { addComment } from "@/firebase/DatabaseService";
import {
  doc,
  collection,
  setDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { getUserID } from "@/firebase/AuthService";

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  collection: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn(),
  Timestamp: {
    now: jest.fn(),
  },
}));

jest.mock("@/firebase/config", () => ({
  db: {},
}));

jest.mock("@/firebase/AuthService", () => ({
  getUserID: jest.fn(),
}));

describe("addComment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add a comment successfully with a logged in user", async () => {
    const eventID = "event-123";
    const content = "Test comment content";
    const userID = "user-456";
    const commentID = "comment-789";
    const mockTimestamp = { seconds: 1616161616, nanoseconds: 123456789 };

    const mockCommentRef = { id: commentID };
    const mockEventRef = { id: eventID };
    const mockUserRef = { id: userID };
    const mockCommentsCollectionRef = { id: "comments" };
    (getUserID as jest.Mock).mockReturnValue(userID);
    (collection as jest.Mock).mockReturnValue(mockCommentsCollectionRef);
    (doc as jest.Mock).mockImplementation((db, path, id) => {
      if (path === "comments" && id === commentID) return mockCommentRef;
      if (path === "events" && id === eventID) return mockEventRef;
      if (path === "users" && id === userID) return mockUserRef;
      if (path === mockCommentsCollectionRef) return mockCommentRef;
      return { id: id || "unknown" }; // Ensure a valid object is always returned
    });
    (Timestamp.now as jest.Mock).mockReturnValue(mockTimestamp);
    (setDoc as jest.Mock).mockResolvedValue(undefined);
    (updateDoc as jest.Mock).mockResolvedValue(undefined);
    (arrayUnion as jest.Mock).mockReturnValue({
      _methodName: "FieldValue.arrayUnion",
    });

    await addComment(eventID, content);

    expect(getUserID).toHaveBeenCalled();
    expect(collection).toHaveBeenCalledWith(db, "comments");
    expect(doc).toHaveBeenCalledWith(mockCommentsCollectionRef);
    expect(doc).toHaveBeenCalledWith(db, "users", userID);
    expect(doc).toHaveBeenCalledWith(db, "events", eventID);
    expect(Timestamp.now).toHaveBeenCalled();
    expect(updateDoc).toHaveBeenCalledWith(mockEventRef, {
      comments: { _methodName: "FieldValue.arrayUnion" },
    });
  });

  it("should throw an error if setDoc fails", async () => {
    const eventID = "event-123";
    const content = "Test comment content";
    const userID = "user-456";
    const commentID = "comment-789";
    const testError = new Error("Test error");

    (getUserID as jest.Mock).mockReturnValue(userID);
    (collection as jest.Mock).mockReturnValue({ id: "comments" });
    (doc as jest.Mock).mockReturnValue({ id: commentID });
    (Timestamp.now as jest.Mock).mockReturnValue({});
    (setDoc as jest.Mock).mockRejectedValue(testError);

    await expect(addComment(eventID, content)).rejects.toThrow(testError);

    expect(setDoc).toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
  });

  it("should throw an error if updateDoc fails", async () => {
    const eventID = "event-123";
    const content = "Test comment content";
    const userID = "user-456";
    const commentID = "comment-789";
    const testError = new Error("Test error");

    (getUserID as jest.Mock).mockReturnValue(userID);
    (collection as jest.Mock).mockReturnValue({ id: "comments" });
    (doc as jest.Mock).mockReturnValue({ id: commentID });
    (Timestamp.now as jest.Mock).mockReturnValue({});
    (setDoc as jest.Mock).mockResolvedValue(undefined);
    (updateDoc as jest.Mock).mockRejectedValue(testError);

    await expect(addComment(eventID, content)).rejects.toThrow(testError);

    expect(setDoc).toHaveBeenCalled();
    expect(updateDoc).toHaveBeenCalled();
  });
});
