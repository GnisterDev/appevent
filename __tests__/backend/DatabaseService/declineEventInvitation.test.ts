import { declineEventInvitation } from "@/firebase/DatabaseService";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "@/firebase/config";
import { getUserID } from "@/firebase/AuthService";

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayRemove: jest.fn(),
}));

jest.mock("@/firebase/config", () => ({
  db: {},
}));

jest.mock("@/firebase/AuthService", () => ({
  getUserID: jest.fn(),
}));

describe("declineEventInvitation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return false if no user is logged in", async () => {
    const eventID = "event-123";
    (getUserID as jest.Mock).mockReturnValue(null);

    const result = await declineEventInvitation(eventID);

    expect(result).toBe(false);
    expect(getUserID).toHaveBeenCalled();
    expect(doc).not.toHaveBeenCalled();
    expect(getDoc).not.toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
  });

  it("should return false if the user does not exist", async () => {
    const eventID = "event-123";
    const userID = "user-456";
    const mockUserRef = { id: userID };

    (getUserID as jest.Mock).mockReturnValue(userID);
    (doc as jest.Mock).mockImplementation((db, collection, id) => {
      if (collection === "users" && id === userID) return mockUserRef;
      return null;
    });
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
      data: () => null,
    });

    const result = await declineEventInvitation(eventID);

    expect(result).toBe(false);
    expect(getUserID).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(db, "users", userID);
    expect(getDoc).toHaveBeenCalledWith(mockUserRef);
    expect(updateDoc).not.toHaveBeenCalled();
  });

  it("should successfully decline an invitation when all conditions are met", async () => {
    const eventID = "event-123";
    const userID = "user-456";
    const mockUserRef = { id: userID };
    const mockEventRef = { id: eventID };

    (getUserID as jest.Mock).mockReturnValue(userID);
    (doc as jest.Mock).mockImplementation((db, collection, id) => {
      if (collection === "users" && id === userID) return mockUserRef;
      if (collection === "events" && id === eventID) return mockEventRef;
      return null;
    });
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ invitations: [mockEventRef] }),
    });
    (arrayRemove as jest.Mock).mockReturnValue({
      _methodName: "FieldValue.arrayRemove",
    });
    (updateDoc as jest.Mock).mockResolvedValue(undefined);

    const result = await declineEventInvitation(eventID);

    expect(result).toBe(true);
    expect(getUserID).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(db, "users", userID);
    expect(doc).toHaveBeenCalledWith(db, "events", eventID);
    expect(getDoc).toHaveBeenCalledWith(mockUserRef);
    expect(arrayRemove).toHaveBeenCalledWith(mockEventRef);
    expect(updateDoc).toHaveBeenCalledWith(mockUserRef, {
      invitations: { _methodName: "FieldValue.arrayRemove" },
    });
  });

  it("should return false if an error occurs during the process", async () => {
    const eventID = "event-123";
    const userID = "user-456";
    const mockUserRef = { id: userID };
    const mockEventRef = { id: eventID };
    const testError = new Error("Test error");

    (getUserID as jest.Mock).mockReturnValue(userID);
    (doc as jest.Mock).mockImplementation((db, collection, id) => {
      if (collection === "users" && id === userID) return mockUserRef;
      if (collection === "events" && id === eventID) return mockEventRef;
      return null;
    });
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ invitations: [mockEventRef] }),
    });
    (arrayRemove as jest.Mock).mockReturnValue({});
    (updateDoc as jest.Mock).mockRejectedValue(testError);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const result = await declineEventInvitation(eventID);

    expect(result).toBe(false);
    expect(getUserID).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(db, "users", userID);
    expect(getDoc).toHaveBeenCalledWith(mockUserRef);
    expect(updateDoc).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error declining invitation:",
      testError
    );

    consoleErrorSpy.mockRestore();
  });
});
