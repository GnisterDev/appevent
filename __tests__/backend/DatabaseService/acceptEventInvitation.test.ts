import { acceptEventInvitation } from "@/firebase/DatabaseService";
import {
  doc,
  getDoc,
  runTransaction,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { getUserID } from "@/firebase/AuthService";

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  runTransaction: jest.fn(),
  arrayRemove: jest.fn(),
  arrayUnion: jest.fn(),
}));

jest.mock("@/firebase/config", () => ({
  db: {},
}));

jest.mock("@/firebase/AuthService", () => ({
  getUserID: jest.fn(),
}));
interface MockRef {
  id: string;
  path?: string;
}

describe("acceptEventInvitation", () => {
  const setup = (
    userID: string,
    eventID: string,
    mockUserRef: MockRef,
    mockEventRef: MockRef
  ): void => {
    (getUserID as jest.Mock).mockReturnValue(userID);
    (doc as jest.Mock).mockImplementation(
      (db: unknown, collection: string, id: string): MockRef | null => {
        if (collection === "users" && id === userID) return mockUserRef;
        if (collection === "events" && id === eventID) return mockEventRef;
        return null;
      }
    );

    (getDoc as jest.Mock).mockImplementation(
      async (
        ref: MockRef
      ): Promise<{ exists: () => boolean; data: () => unknown } | null> => {
        if (ref === mockEventRef) {
          return {
            exists: () => false,
            data: () => null,
          };
        }
        if (ref === mockUserRef) {
          return {
            exists: () => true,
            data: () => ({}),
          };
        }
        return null;
      }
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return false if no user is logged in", async () => {
    const eventID = "event-123";
    (getUserID as jest.Mock).mockReturnValue(null);

    const result = await acceptEventInvitation(eventID);

    expect(result).toBe(false);
    expect(getUserID).toHaveBeenCalled();
    expect(doc).not.toHaveBeenCalled();
    expect(getDoc).not.toHaveBeenCalled();
    expect(runTransaction).not.toHaveBeenCalled();
  });

  it("should return false if the event does not exist", async () => {
    const eventID = "event-123";
    const userID = "user-456";
    const mockUserRef = { id: userID };
    const mockEventRef = { id: eventID };

    setup(userID, eventID, mockUserRef, mockEventRef);

    const result = await acceptEventInvitation(eventID);

    expect(result).toBe(false);
    expect(getUserID).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(db, "events", eventID);
    expect(doc).toHaveBeenCalledWith(db, "users", userID);
    expect(getDoc).toHaveBeenCalledWith(mockEventRef);
    expect(getDoc).toHaveBeenCalledWith(mockUserRef);
    expect(runTransaction).not.toHaveBeenCalled();
  });

  it("should return false if the user does not exist", async () => {
    const eventID = "event-123";
    const userID = "user-456";
    const mockUserRef = { id: userID };
    const mockEventRef = { id: eventID };

    setup(userID, eventID, mockUserRef, mockEventRef);

    const result = await acceptEventInvitation(eventID);

    expect(result).toBe(false);
    expect(getUserID).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(db, "events", eventID);
    expect(doc).toHaveBeenCalledWith(db, "users", userID);
    expect(getDoc).toHaveBeenCalledWith(mockEventRef);
    expect(getDoc).toHaveBeenCalledWith(mockUserRef);
    expect(runTransaction).not.toHaveBeenCalled();
  });

  it("should return false if user is already a participant", async () => {
    const eventID = "event-123";
    const userID = "user-456";
    const mockUserRef = { id: userID };
    const mockEventRef = { id: eventID };

    setup(userID, eventID, mockUserRef, mockEventRef);

    const result = await acceptEventInvitation(eventID);

    expect(result).toBe(false);
    expect(getUserID).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(db, "events", eventID);
    expect(doc).toHaveBeenCalledWith(db, "users", userID);
    expect(getDoc).toHaveBeenCalledWith(mockEventRef);
    expect(getDoc).toHaveBeenCalledWith(mockUserRef);
    expect(runTransaction).not.toHaveBeenCalled();
  });

  it("should return false if user does not have an invitation", async () => {
    const eventID = "event-123";
    const userID = "user-456";
    const mockUserRef = { id: userID };
    const mockEventRef = { id: eventID, path: `events/${eventID}` };

    setup(userID, eventID, mockUserRef, mockEventRef);

    const result = await acceptEventInvitation(eventID);

    expect(result).toBe(false);
    expect(getUserID).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(db, "events", eventID);
    expect(doc).toHaveBeenCalledWith(db, "users", userID);
    expect(getDoc).toHaveBeenCalledWith(mockEventRef);
    expect(getDoc).toHaveBeenCalledWith(mockUserRef);
    expect(runTransaction).not.toHaveBeenCalled();
  });

  it("should successfully accept an invitation when all conditions are met", async () => {
    const eventID = "event-123";
    const userID = "user-456";
    const mockUserRef = { id: userID };
    const mockEventRef = { id: eventID, path: `events/${eventID}` };

    (getUserID as jest.Mock).mockReturnValue(userID);
    (doc as jest.Mock).mockImplementation((db, collection, id) => {
      if (collection === "users" && id === userID) return mockUserRef;
      if (collection === "events" && id === eventID) return mockEventRef;
      return null;
    });

    (getDoc as jest.Mock).mockImplementation(async ref => {
      if (ref === mockEventRef) {
        return {
          exists: () => true,
          data: () => ({
            participants: [{ id: "other-user" }],
          }),
        };
      }
      if (ref === mockUserRef) {
        return {
          exists: () => true,
          data: () => ({
            invitations: [mockEventRef],
          }),
        };
      }
      return null;
    });

    (arrayRemove as jest.Mock).mockReturnValue({ _method: "arrayRemove" });
    (arrayUnion as jest.Mock).mockReturnValue({ _method: "arrayUnion" });
    (runTransaction as jest.Mock).mockImplementation(async (db, callback) => {
      const mockTransaction = {
        update: jest.fn(),
      };
      return await callback(mockTransaction);
    });

    const result = await acceptEventInvitation(eventID);

    expect(result).toBe(true);
    expect(getUserID).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(db, "events", eventID);
    expect(doc).toHaveBeenCalledWith(db, "users", userID);
    expect(getDoc).toHaveBeenCalledWith(mockEventRef);
    expect(getDoc).toHaveBeenCalledWith(mockUserRef);
    expect(arrayRemove).toHaveBeenCalledWith(mockEventRef);
    expect(arrayUnion).toHaveBeenCalledWith(mockUserRef);
    expect(runTransaction).toHaveBeenCalled();
  });

  it("should return false if an error occurs during the process", async () => {
    const eventID = "event-123";
    const userID = "user-456";
    const mockUserRef = { id: userID };
    const mockEventRef = { id: eventID, path: `events/${eventID}` };
    const testError = new Error("Test error");

    (getUserID as jest.Mock).mockReturnValue(userID);
    (doc as jest.Mock).mockImplementation((db, collection, id) => {
      if (collection === "users" && id === userID) return mockUserRef;
      if (collection === "events" && id === eventID) return mockEventRef;
      return null;
    });

    (getDoc as jest.Mock).mockImplementation(async ref => {
      if (ref === mockEventRef) {
        return {
          exists: () => true,
          data: () => ({
            participants: [{ id: "other-user" }],
          }),
        };
      }
      if (ref === mockUserRef) {
        return {
          exists: () => true,
          data: () => ({
            invitations: [mockEventRef],
          }),
        };
      }
      return null;
    });

    (runTransaction as jest.Mock).mockRejectedValue(testError);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const result = await acceptEventInvitation(eventID);

    expect(result).toBe(false);
    expect(getUserID).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(db, "events", eventID);
    expect(doc).toHaveBeenCalledWith(db, "users", userID);
    expect(getDoc).toHaveBeenCalledWith(mockEventRef);
    expect(getDoc).toHaveBeenCalledWith(mockUserRef);
    expect(runTransaction).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error accepting invitation:",
      testError
    );

    consoleErrorSpy.mockRestore();
  });
});
