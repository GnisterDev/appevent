import { getEventsByRole } from "@/firebase/DatabaseService";
import { collection, getDocs, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { getUserID } from "@/firebase/AuthService";
import { DefaultListEvents } from "@/firebase/Event";

jest.mock("@/firebase/config", () => ({
  db: {},
}));

jest.mock("@/firebase/AuthService", () => ({
  getUserID: jest.fn(),
}));

describe("getEventsByRole", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return DefaultListEvents if no user is logged in", async () => {
    (getUserID as jest.Mock).mockReturnValue(null);

    const result = await getEventsByRole();

    expect(result).toEqual(DefaultListEvents);
    expect(getUserID).toHaveBeenCalled();
    expect(getDocs).not.toHaveBeenCalled();
    expect(getDoc).not.toHaveBeenCalled();
  });

  it("should throw an error if Firebase operations fail", async () => {
    const mockUserID = "user-123";
    const mockError = new Error("Firebase error");

    (getUserID as jest.Mock).mockReturnValue(mockUserID);
    (collection as jest.Mock).mockReturnValue({});
    (getDocs as jest.Mock).mockRejectedValue(mockError);

    await expect(getEventsByRole()).rejects.toThrow(mockError);
    expect(getUserID).toHaveBeenCalled();
    expect(collection).toHaveBeenCalledWith(db, "events");
    expect(getDocs).toHaveBeenCalled();
  });
});
