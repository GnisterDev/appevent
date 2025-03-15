import { getAllParticipants } from "@/firebase/DatabaseService";
import { doc, DocumentReference, getDoc } from "firebase/firestore";

describe("getAllParticipants", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns empty array when event has no participants", async () => {
    const mockEventSnap = {
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        participants: [],
      }),
    };

    (getDoc as jest.Mock).mockResolvedValue(mockEventSnap);
    (doc as jest.Mock).mockReturnValue("event-doc-ref");

    const result = await getAllParticipants("event123");

    expect(result).toEqual([]);
    expect(doc).toHaveBeenCalledWith(expect.anything(), "events", "event123");
    expect(getDoc).toHaveBeenCalledWith("event-doc-ref");
  });

  test("throws error when event does not exist", async () => {
    const mockEventSnap = {
      exists: jest.fn().mockReturnValue(false),
      data: jest.fn(),
    };

    (getDoc as jest.Mock).mockResolvedValue(mockEventSnap);
    (doc as jest.Mock).mockReturnValue("event-doc-ref");

    await expect(getAllParticipants("non-existent-event")).rejects.toThrow(
      "Event with ID non-existent-event not found"
    );

    expect(doc).toHaveBeenCalledWith(
      expect.anything(),
      "events",
      "non-existent-event"
    );
    expect(getDoc).toHaveBeenCalledWith("event-doc-ref");
  });

  test("returns array of users when event has participants", async () => {
    const mockParticipantRef1 = {} as DocumentReference;
    const mockParticipantRef2 = {} as DocumentReference;

    const mockEventSnap = {
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        participants: [mockParticipantRef1, mockParticipantRef2],
      }),
    };

    const mockUser1Snap = {
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        name: "User One",
        email: "user1@example.com",
      }),
      id: "user1",
    };

    const mockUser2Snap = {
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        name: "User Two",
        email: "user2@example.com",
      }),
      id: "user2",
    };

    (doc as jest.Mock).mockReturnValue("event-doc-ref");

    (getDoc as jest.Mock)
      .mockResolvedValueOnce(mockEventSnap)
      .mockResolvedValueOnce(mockUser1Snap)
      .mockResolvedValueOnce(mockUser2Snap);

    const result = await getAllParticipants("event123");

    expect(result).toEqual([
      { name: "User One", email: "user1@example.com", userID: "user1" },
      { name: "User Two", email: "user2@example.com", userID: "user2" },
    ]);

    expect(doc).toHaveBeenCalledWith(expect.anything(), "events", "event123");
    expect(getDoc).toHaveBeenCalledTimes(3); // Once for event, twice for users
  });

  test("filters out non-existent user references", async () => {
    const mockParticipantRef1 = {} as DocumentReference;
    const mockParticipantRef2 = {} as DocumentReference;

    const mockEventSnap = {
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        participants: [mockParticipantRef1, mockParticipantRef2],
      }),
    };

    const mockUser1Snap = {
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        name: "User One",
        email: "user1@example.com",
      }),
      id: "user1",
    };

    const mockUser2Snap = {
      exists: jest.fn().mockReturnValue(false),
      data: jest.fn(),
      id: "user2",
    };

    (doc as jest.Mock).mockReturnValue("event-doc-ref");
    (getDoc as jest.Mock)
      .mockResolvedValueOnce(mockEventSnap)
      .mockResolvedValueOnce(mockUser1Snap)
      .mockResolvedValueOnce(mockUser2Snap);

    const result = await getAllParticipants("event123");

    expect(result).toEqual([
      { name: "User One", email: "user1@example.com", userID: "user1" },
    ]);

    expect(getDoc).toHaveBeenCalledTimes(3);
  });

  test("throws and logs any errors that occur", async () => {
    const mockError = new Error("Database connection error");
    (doc as jest.Mock).mockReturnValue("event-doc-ref");
    (getDoc as jest.Mock).mockRejectedValue(mockError);

    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    await expect(getAllParticipants("event123")).rejects.toThrow(
      "Database connection error"
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      `Error fetching participants ${mockError}`
    );
    consoleSpy.mockRestore();
  });

  test("handles undefined participants field gracefully", async () => {
    const mockEventSnap = {
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({}),
    };

    (getDoc as jest.Mock).mockResolvedValue(mockEventSnap);
    (doc as jest.Mock).mockReturnValue("event-doc-ref");

    const result = await getAllParticipants("event123");

    expect(result).toEqual([]);
    expect(doc).toHaveBeenCalledWith(expect.anything(), "events", "event123");
    expect(getDoc).toHaveBeenCalledWith("event-doc-ref");
  });
});
