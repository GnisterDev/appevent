import { db } from "@/firebase/config";
import { getAllInvited } from "@/firebase/DatabaseService";
import { UserData } from "@/firebase/User";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

describe("getAllInvited", () => {
  const mockEventID = "mockEventID";
  const mockEventRef = { id: mockEventID };
  const mockUserData: UserData = {
    userID: "user1",
    name: "John Doe",
    email: "john@example.com",
    type: "user",
    invitations: [],
    location: "Test Location",
    description: "Test Description",
    interests: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (doc as jest.Mock).mockReturnValue(mockEventRef);
  });

  it("should return an empty array if the event does not exist", async () => {
    (getDoc as jest.Mock).mockResolvedValue({ exists: () => false });

    const result = await getAllInvited(mockEventID);

    expect(doc).toHaveBeenCalledWith(db, "events", mockEventID);
    expect(getDoc).toHaveBeenCalledWith(mockEventRef);
    expect(result).toEqual([]);
  });

  it("should return an array of invited users if the event exists", async () => {
    (getDoc as jest.Mock).mockResolvedValue({ exists: () => true });
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        { data: () => mockUserData },
        {
          data: () => ({ ...mockUserData, userID: "user2", name: "Jane Doe" }),
        },
      ],
    });

    const result = await getAllInvited(mockEventID);

    expect(doc).toHaveBeenCalledWith(db, "events", mockEventID);
    expect(getDoc).toHaveBeenCalledWith(mockEventRef);
    expect(collection).toHaveBeenCalledWith(db, "users");
    expect(where).toHaveBeenCalledWith(
      "invitations",
      "array-contains",
      mockEventRef
    );
    expect(query).toHaveBeenCalled();
    expect(getDocs).toHaveBeenCalled();
    expect(result).toEqual([
      mockUserData,
      { ...mockUserData, userID: "user2", name: "Jane Doe" },
    ]);
  });

  it("should return an empty array and log an error if an exception occurs", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    (getDoc as jest.Mock).mockRejectedValue(new Error("Test error"));

    const result = await getAllInvited(mockEventID);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error getting invited users:",
      expect.any(Error)
    );
    expect(result).toEqual([]);

    consoleErrorSpy.mockRestore();
  });
});
