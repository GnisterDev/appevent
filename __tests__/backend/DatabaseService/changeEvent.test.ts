import { db } from "@/firebase/config";
import { changeEvent } from "@/firebase/DatabaseService";
import { doc, updateDoc } from "firebase/firestore";

describe("changeEvent", () => {
  const mockEventID = "testEventID";
  const mockEventData = { name: "Updated Event Name" };

  it("should call updateDoc with the correct arguments", async () => {
    const mockDoc = {};
    (doc as jest.Mock).mockReturnValue(mockDoc);

    await changeEvent(mockEventID, mockEventData);

    expect(doc).toHaveBeenCalledWith(db, "events", mockEventID);
    expect(updateDoc).toHaveBeenCalledWith(mockDoc, mockEventData);
  });

  it("should throw an error if updateDoc fails", async () => {
    const mockError = new Error("Failed to update document");
    (updateDoc as jest.Mock).mockRejectedValue(mockError);

    await expect(changeEvent(mockEventID, mockEventData)).rejects.toThrow(
      "Failed to update document"
    );
  });
});
