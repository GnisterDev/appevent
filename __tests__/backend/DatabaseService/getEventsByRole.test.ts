import { getEventsByRole } from "@/firebase/DatabaseService";
import { collection, getDocs, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { getUserID } from "@/firebase/AuthService";
import { DefaultListEvents } from "@/firebase/Event";

jest.mock("@/firebase/config", () => ({
  db: {},
}));

// Mock getUserID function
jest.mock("@/firebase/AuthService", () => ({
  getUserID: jest.fn(),
}));

describe("getEventsByRole", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should return DefaultListEvents if no user is logged in", async () => {
    // Arrange
    (getUserID as jest.Mock).mockReturnValue(null);

    // Act
    const result = await getEventsByRole();

    // Assert
    expect(result).toEqual(DefaultListEvents);
    expect(getUserID).toHaveBeenCalled();
    expect(getDocs).not.toHaveBeenCalled();
    expect(getDoc).not.toHaveBeenCalled();
  });

  it("should throw an error if Firebase operations fail", async () => {
    // Arrange
    const mockUserID = "user-123";
    const mockError = new Error("Firebase error");

    (getUserID as jest.Mock).mockReturnValue(mockUserID);
    (collection as jest.Mock).mockReturnValue({});
    (getDocs as jest.Mock).mockRejectedValue(mockError);

    // Act & Assert
    await expect(getEventsByRole()).rejects.toThrow(mockError);
    expect(getUserID).toHaveBeenCalled();
    expect(collection).toHaveBeenCalledWith(db, "events");
    expect(getDocs).toHaveBeenCalled();
  });
});
