import { db } from "@/firebase/config";
import { deleteUser } from "@/firebase/DatabaseService";
import { deleteDoc, doc } from "firebase/firestore";

describe("deleteUser", () => {
  const mockUserID = "testUserID";

  it("should call deleteDoc with the correct document reference", async () => {
    const mockDocRef = {};
    (doc as jest.Mock).mockReturnValue(mockDocRef);

    await deleteUser(mockUserID);

    expect(doc).toHaveBeenCalledWith(db, "users", mockUserID);
    expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
  });

  it("should throw an error if deleteDoc fails", async () => {
    (deleteDoc as jest.Mock).mockRejectedValue(new Error("Delete failed"));

    await expect(deleteUser(mockUserID)).rejects.toThrow("Delete failed");
  });
});
