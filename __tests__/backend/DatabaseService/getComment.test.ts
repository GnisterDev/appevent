import { getComment } from "@/firebase/DatabaseService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock("@/firebase/config", () => ({
  db: {},
}));

describe("getComment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a comment when it exists", async () => {
    const commentID = "test-comment-id";
    const mockCommentRef = { id: commentID };
    const mockCommentData = {
      id: commentID,
      text: "Test comment",
      author: { id: "user1", name: "User 1" },
      createdAt: new Date(),
    };

    (doc as jest.Mock).mockReturnValue(mockCommentRef);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => mockCommentData,
    });

    const result = await getComment(commentID);

    expect(doc).toHaveBeenCalledWith(db, "comments", commentID);
    expect(getDoc).toHaveBeenCalledWith(mockCommentRef);
    expect(result).toEqual(mockCommentData);
  });

  it("should return null when comment does not exist", async () => {
    const commentID = "nonexistent-comment";
    const mockCommentRef = { id: commentID };
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    (doc as jest.Mock).mockReturnValue(mockCommentRef);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
      data: () => null,
    });

    const result = await getComment(commentID);

    expect(doc).toHaveBeenCalledWith(db, "comments", commentID);
    expect(getDoc).toHaveBeenCalledWith(mockCommentRef);
    expect(consoleSpy).toHaveBeenCalledWith(
      `Comment with ID ${commentID} not found`
    );
    expect(result).toBeNull();

    consoleSpy.mockRestore();
  });

  it("should throw an error when the Firestore operation fails", async () => {
    const commentID = "test-comment-id";
    const mockCommentRef = { id: commentID };
    const mockError = new Error("Firestore error");
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    (doc as jest.Mock).mockReturnValue(mockCommentRef);
    (getDoc as jest.Mock).mockRejectedValue(mockError);

    await expect(getComment(commentID)).rejects.toThrow(mockError);

    expect(doc).toHaveBeenCalledWith(db, "comments", commentID);
    expect(getDoc).toHaveBeenCalledWith(mockCommentRef);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error getting comment:",
      mockError
    );

    consoleSpy.mockRestore();
  });
});
