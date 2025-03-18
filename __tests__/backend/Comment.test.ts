import { DefaultComment, Comment } from "@/firebase/Comment";
import { DocumentReference, Timestamp } from "firebase/firestore";

describe("Comment Type and DefaultComment", () => {
  it("should have a valid DefaultComment object", () => {
    expect(DefaultComment).toBeDefined();
    expect(DefaultComment.commentID).toBe("");
    expect(DefaultComment.author).toBeNull();
    expect(DefaultComment.content).toBe("");
    expect(DefaultComment.time).toBeNull();
  });

  it("should match the Comment type structure", () => {
    const testComment: Comment = {
      commentID: "123",
      author: {} as DocumentReference, // Mocking DocumentReference
      content: "This is a test comment",
      time: Timestamp.now(),
    };

    expect(testComment.commentID).toBe("123");
    expect(testComment.author).toBeDefined();
    expect(testComment.content).toBe("This is a test comment");
    expect(testComment.time).toBeInstanceOf(Object);
  });
});
