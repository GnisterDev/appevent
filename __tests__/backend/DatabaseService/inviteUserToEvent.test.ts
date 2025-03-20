import { inviteUserToEvent } from "@/firebase/DatabaseService";
import {
  arrayUnion,
  doc,
  DocumentReference,
  getDoc,
  updateDoc,
} from "firebase/firestore";

describe("inviteUserToEvent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns false when event does not exist", async () => {
    const mockEventRef = { id: "event123" } as DocumentReference;
    const mockUserRef = { id: "user123" } as DocumentReference;

    (doc as jest.Mock)
      .mockReturnValueOnce(mockEventRef)
      .mockReturnValueOnce(mockUserRef);

    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(false),
      data: jest.fn(),
    });

    const result = await inviteUserToEvent("event123", "user123");

    expect(result).toBe(false);
    expect(doc).toHaveBeenCalledWith(expect.anything(), "events", "event123");
    expect(doc).toHaveBeenCalledWith(expect.anything(), "users", "user123");
    expect(getDoc).toHaveBeenCalledWith(mockEventRef);
    expect(updateDoc).not.toHaveBeenCalled();
  });

  test("returns false when event is not private", async () => {
    const mockEventRef = { id: "event123" } as DocumentReference;
    const mockUserRef = { id: "user123" } as DocumentReference;

    (doc as jest.Mock)
      .mockReturnValueOnce(mockEventRef)
      .mockReturnValueOnce(mockUserRef);

    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        private: false,
        participants: [],
      }),
    });

    const result = await inviteUserToEvent("event123", "user123");

    expect(result).toBe(false);
    expect(getDoc).toHaveBeenCalledWith(mockEventRef);
    expect(updateDoc).not.toHaveBeenCalled();
  });

  test("returns false when user does not exist", async () => {
    const mockEventRef = { id: "event123" } as DocumentReference;
    const mockUserRef = { id: "user123" } as DocumentReference;

    (doc as jest.Mock)
      .mockReturnValueOnce(mockEventRef)
      .mockReturnValueOnce(mockUserRef);

    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        private: true,
        participants: [],
      }),
    });

    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(false),
      data: jest.fn(),
    });

    const result = await inviteUserToEvent("event123", "user123");

    expect(result).toBe(false);
    expect(getDoc).toHaveBeenCalledWith(mockUserRef);
    expect(updateDoc).not.toHaveBeenCalled();
  });

  test("returns false when user is already a participant", async () => {
    const mockEventRef = { id: "event123" } as DocumentReference;
    const mockUserRef = { id: "user123" } as DocumentReference;
    const mockParticipantRef = { id: "user123" } as DocumentReference;

    (doc as jest.Mock)
      .mockReturnValueOnce(mockEventRef)
      .mockReturnValueOnce(mockUserRef);

    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        private: true,
        participants: [mockParticipantRef],
      }),
    });

    const result = await inviteUserToEvent("event123", "user123");

    expect(result).toBe(false);
    expect(updateDoc).not.toHaveBeenCalled();
  });

  test("returns false when user is already invited", async () => {
    const mockEventRef = {
      id: "event123",
      path: "events/event123",
    } as DocumentReference;
    const mockUserRef = { id: "user123" } as DocumentReference;

    (doc as jest.Mock)
      .mockReturnValueOnce(mockEventRef)
      .mockReturnValueOnce(mockUserRef);

    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        private: true,
        participants: [],
      }),
    });

    const mockInvitationRef = { path: "events/event123" } as DocumentReference;
    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        invitations: [mockInvitationRef],
      }),
    });

    const result = await inviteUserToEvent("event123", "user123");

    expect(result).toBe(false);
    expect(updateDoc).not.toHaveBeenCalled();
  });

  test("returns true and updates user when invitation is successful", async () => {
    const mockEventRef = {
      id: "event123",
      path: "events/event123",
    } as DocumentReference;
    const mockUserRef = { id: "user123" } as DocumentReference;

    (doc as jest.Mock)
      .mockReturnValueOnce(mockEventRef)
      .mockReturnValueOnce(mockUserRef);

    (arrayUnion as jest.Mock).mockReturnValue("array-union-result");

    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        private: true,
        participants: [],
      }),
    });

    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        invitations: [],
      }),
    });

    (updateDoc as jest.Mock).mockResolvedValue(undefined);

    const result = await inviteUserToEvent("event123", "user123");

    expect(result).toBe(true);
    expect(updateDoc).toHaveBeenCalledWith(mockUserRef, {
      invitations: "array-union-result",
    });
    expect(arrayUnion).toHaveBeenCalledWith(mockEventRef);
  });

  test("returns false when database error occurs", async () => {
    const mockEventRef = { id: "event123" } as DocumentReference;
    const mockUserRef = { id: "user123" } as DocumentReference;

    (doc as jest.Mock)
      .mockReturnValueOnce(mockEventRef)
      .mockReturnValueOnce(mockUserRef);

    (getDoc as jest.Mock).mockRejectedValue(new Error("Database error"));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const result = await inviteUserToEvent("event123", "user123");

    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error inviting user:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
