import { db } from "@/firebase/config";
import { changeUser } from "@/firebase/DatabaseService";
import { updateDoc, doc } from "firebase/firestore";

describe("changeUser", () => {
  const mockUserID = "testUserID";
  const mockData = { name: "New Name", email: "newemail@example.com" };

  it("should call updateDoc with the correct arguments", async () => {
    const mockDoc = {};
    (doc as jest.Mock).mockReturnValue(mockDoc);

    await changeUser(mockUserID, mockData);

    expect(doc).toHaveBeenCalledWith(db, "users", mockUserID);
    expect(updateDoc).toHaveBeenCalledWith(mockDoc, mockData);
  });

  it("should throw an error if updateDoc fails", async () => {
    const mockError = new Error("Failed to update document");
    (updateDoc as jest.Mock).mockRejectedValue(mockError);

    await expect(changeUser(mockUserID, mockData)).rejects.toThrow(
      "Failed to update document"
    );
  });
});
