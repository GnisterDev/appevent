import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CommentInput from "@/components/event/overview/comments/CommentInput";
import { useAuth } from "@/firebase/AuthService";
import { getUser } from "@/firebase/DatabaseService";

// Mock `useAuth` og `getUser` for å unngå databasekall i testen
jest.mock("@/firebase/AuthService", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/firebase/DatabaseService", () => ({
  getUser: jest.fn(),
}));

describe("CommentInput component", () => {
  const mockOnAddComment = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders textarea and send button", () => {
    render(<CommentInput onAddComment={mockOnAddComment} />);

    expect(screen.getByPlaceholderText("...")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  test("allows user to type in textarea", () => {
    render(<CommentInput onAddComment={mockOnAddComment} />);

    const textarea = screen.getByPlaceholderText("...");

    fireEvent.change(textarea, { target: { value: "Test kommentar" } });

    expect(textarea).toHaveValue("Test kommentar");
  });

  test("calls onAddComment when clicking send button", async () => {
    (useAuth as jest.Mock).mockReturnValue({ userID: "123" });
    (getUser as jest.Mock).mockResolvedValue({ name: "Test User" });

    render(<CommentInput onAddComment={mockOnAddComment} />);

    const textarea = screen.getByPlaceholderText("...");
    const sendButton = screen.getByText("Send");

    fireEvent.change(textarea, { target: { value: "Test kommentar" } });
    fireEvent.click(sendButton);

    expect(mockOnAddComment).toHaveBeenCalledWith(
      "Test kommentar",
      "123",
      "Test User"
    );
  });

  test("calls onAddComment when pressing Enter", async () => {
    (useAuth as jest.Mock).mockReturnValue({ userID: "123" });
    (getUser as jest.Mock).mockResolvedValue({ name: "Test User" });

    render(<CommentInput onAddComment={mockOnAddComment} />);

    const textarea = screen.getByPlaceholderText("...");

    fireEvent.change(textarea, { target: { value: "Test kommentar" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(mockOnAddComment).toHaveBeenCalledWith(
      "Test kommentar",
      "123",
      "Test User"
    );
  });

  test("does not call onAddComment if textarea is empty", () => {
    render(<CommentInput onAddComment={mockOnAddComment} />);

    const sendButton = screen.getByText("Send");
    fireEvent.click(sendButton);

    expect(mockOnAddComment).not.toHaveBeenCalled();
  });
});
