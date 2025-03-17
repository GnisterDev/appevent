import { db } from "@/firebase/config";
import { deleteEvent } from "@/firebase/DatabaseService";
import { deleteDoc, doc } from "firebase/firestore";

describe("deleteEvent", () => {
  const mockEventID = "testEventID";

  it("should call deleteDoc with the correct document reference", async () => {
    const mockDoc = { id: mockEventID };
    (doc as jest.Mock).mockReturnValue(mockDoc);

    await deleteEvent(mockEventID);

    expect(doc).toHaveBeenCalledWith(db, "events", mockEventID);
    expect(deleteDoc).toHaveBeenCalledWith(mockDoc);
  });

  it("should throw an error if deleteDoc fails", async () => {
    const mockError = new Error("Failed to delete document");
    (deleteDoc as jest.Mock).mockRejectedValue(mockError);

    await expect(deleteEvent(mockEventID)).rejects.toThrow(
      "Failed to delete document"
    );
  });
});
