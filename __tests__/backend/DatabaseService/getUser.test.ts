import { db } from "@/firebase/config";
import { getUser } from "@/firebase/DatabaseService";
import { UserData } from "@/firebase/User";
import { doc, getDoc } from "firebase/firestore";

describe("getUser", () => {
  const mockUserID = "testUserID";
  const mockUserData: UserData = {
    userID: mockUserID,
    name: "Test User",
    email: "test@example.com",
    type: "user",
    invitations: [],
    location: "Test Location",
    description: "Test Description",
    interests: ["Test Interest"],
  };

  it("should return user data when the document exists", async () => {
    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => mockUserData,
    });

    const result = await getUser(mockUserID);

    expect(doc).toHaveBeenCalledWith(db, "users", mockUserID);
    expect(getDoc).toHaveBeenCalledWith(expect.any(Object));
    expect(result).toEqual(mockUserData);
  });

  it("should throw an error when the document does not exist", async () => {
    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => false,
    });

    await expect(getUser(mockUserID)).rejects.toThrow(
      "User document does not exist"
    );

    expect(doc).toHaveBeenCalledWith(db, "users", mockUserID);
    expect(getDoc).toHaveBeenCalledWith(expect.any(Object));
  });

  it("should throw an error when getDoc fails", async () => {
    const mockError = new Error("Firestore error");
    (getDoc as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(getUser(mockUserID)).rejects.toThrow(mockError);

    expect(doc).toHaveBeenCalledWith(db, "users", mockUserID);
    expect(getDoc).toHaveBeenCalledWith(expect.any(Object));
  });
});
