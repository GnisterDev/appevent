import { deleteComment } from "@/firebase/DatabaseService";
import { doc, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "@/firebase/config";

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  deleteDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayRemove: jest.fn(),
}));

jest.mock("@/firebase/config", () => ({
  db: {},
}));

describe("deleteComment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a comment and update the event document", async () => {
    const eventID = "event-123";
    const commentID = "comment-456";
    const mockEventRef = { id: eventID };
    const mockCommentRef = { id: commentID };

    (doc as jest.Mock).mockImplementation((db, collection) => {
      if (collection === "events") return mockEventRef;
      if (collection === "comments") return mockCommentRef;
      return null;
    });

    (deleteDoc as jest.Mock).mockResolvedValue(undefined);
    (updateDoc as jest.Mock).mockResolvedValue(undefined);
    (arrayRemove as jest.Mock).mockReturnValue({ value: "arrayRemoveValue" });

    await deleteComment(eventID, commentID);

    expect(doc).toHaveBeenCalledWith(db, "events", eventID);
    expect(doc).toHaveBeenCalledWith(db, "comments", commentID);
    expect(deleteDoc).toHaveBeenCalledWith(mockCommentRef);
    expect(arrayRemove).toHaveBeenCalledWith(mockCommentRef);
    expect(updateDoc).toHaveBeenCalledWith(mockEventRef, {
      comments: { value: "arrayRemoveValue" },
    });
  });

  it("should throw an error if deleteDoc fails", async () => {
    const eventID = "event-123";
    const commentID = "comment-456";
    const testError = new Error("Test error");

    (doc as jest.Mock).mockImplementation((db, collection) => {
      if (collection === "events") return { id: eventID };
      if (collection === "comments") return { id: commentID };
      return null;
    });

    (deleteDoc as jest.Mock).mockRejectedValue(testError);

    await expect(deleteComment(eventID, commentID)).rejects.toThrow(testError);
    expect(updateDoc).not.toHaveBeenCalled();
  });

  it("should throw an error if updateDoc fails", async () => {
    const eventID = "event-123";
    const commentID = "comment-456";
    const testError = new Error("Test error");

    (doc as jest.Mock).mockImplementation((db, collection) => {
      if (collection === "events") return { id: eventID };
      if (collection === "comments") return { id: commentID };
      return null;
    });

    (deleteDoc as jest.Mock).mockResolvedValue(undefined);
    (updateDoc as jest.Mock).mockRejectedValue(testError);
    (arrayRemove as jest.Mock).mockReturnValue({});

    // Act & Assert
    await expect(deleteComment(eventID, commentID)).rejects.toThrow(testError);
    expect(deleteDoc).toHaveBeenCalled();
  });
});
