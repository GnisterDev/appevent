import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CommentItem from "@/components/event/overview/comments/CommentItem";
import { Comment } from "@/firebase/Comment";
import { getUser } from "@/firebase/DatabaseService";
import { isAdministrator } from "@/firebase/AuthService";
import { DocumentReference, Timestamp } from "firebase/firestore";

jest.mock("@/firebase/DatabaseService", () => ({
  getUser: jest.fn(),
}));

jest.mock("@/firebase/AuthService", () => ({
  isAdministrator: jest.fn(),
}));

jest.mock("lucide-react", () => ({
  Trash: () => <svg data-testid="trash-icon" />,
}));

const mockComment: Comment = {
  commentID: "commentID1",
  author: { id: "userID1" } as unknown as DocumentReference,
  content: "This is a test comment",
  time: Timestamp.fromDate(new Date("2023-01-01T12:00:00Z")),
};

describe("CommentItem", () => {
  it("renders the comment content and formatted date", async () => {
    (getUser as jest.Mock).mockResolvedValue({ name: "Test User" });
    (isAdministrator as jest.Mock).mockReturnValue(false);

    render(<CommentItem comment={mockComment} onDelete={jest.fn()} />);

    expect(screen.getByText("This is a test comment")).toBeInTheDocument();
    expect(screen.getByText("01/01/2023 13:00")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });
  });

  it("shows delete button if user is an administrator", async () => {
    (getUser as jest.Mock).mockResolvedValue({ name: "Test User" });
    (isAdministrator as jest.Mock).mockReturnValue(true);

    render(<CommentItem comment={mockComment} onDelete={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByTestId("trash-icon")).toBeInTheDocument();
    });
  });

  it("does not show delete button if user is not an administrator", async () => {
    (getUser as jest.Mock).mockResolvedValue({ name: "Test User" });
    (isAdministrator as jest.Mock).mockReturnValue(false);

    render(<CommentItem comment={mockComment} onDelete={jest.fn()} />);

    await waitFor(() => {
      expect(screen.queryByTestId("trash-icon")).not.toBeInTheDocument();
    });
  });

  it("calls onDelete when delete button is clicked", async () => {
    (getUser as jest.Mock).mockResolvedValue({ name: "Test User" });
    (isAdministrator as jest.Mock).mockReturnValue(true);

    const mockOnDelete = jest.fn();

    render(<CommentItem comment={mockComment} onDelete={mockOnDelete} />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("trash-icon"));
    });

    expect(mockOnDelete).toHaveBeenCalledWith(mockComment);
  });
});
