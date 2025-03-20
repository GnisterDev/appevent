import { createUser } from "@/firebase/DatabaseService";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { UserData } from "@/firebase/User";

describe("createUser", () => {
  it("should call setDoc with the correct arguments", async () => {
    const mockUser: UserData = {
      userID: "123",
      name: "Test User",
      email: "test@example.com",
      type: "user",
      invitations: [],
      location: "Test Location",
      description: "Test Description",
      interests: ["Test Interest"],
    };

    const mockDocRef = {};
    (doc as jest.Mock).mockReturnValue(mockDocRef);

    await createUser(mockUser);

    expect(doc).toHaveBeenCalledWith(db, "users", mockUser.userID);
    expect(setDoc).toHaveBeenCalledWith(mockDocRef, mockUser);
  });

  it("should throw an error if setDoc fails", async () => {
    const mockUser: UserData = {
      userID: "123",
      name: "Test User",
      email: "test@example.com",
      type: "user",
      invitations: [],
      location: "Test Location",
      description: "Test Description",
      interests: ["Test Interest"],
    };

    (setDoc as jest.Mock).mockRejectedValue(new Error("Failed to create user"));

    await expect(createUser(mockUser)).rejects.toThrow("Failed to create user");
  });
});
