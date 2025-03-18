import React from "react";
import { render, screen, fireEvent } from "@/test-utils";
import CommentInput from "@/components/event/overview/comments/CommentInput";
import { useAuth } from "@/firebase/AuthService";
import { getUser } from "@/firebase/DatabaseService";
import "@testing-library/jest-dom";

jest.mock("@/firebase/AuthService", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/firebase/DatabaseService", () => ({
  getUser: jest.fn(),
}));

describe("CommentInput Component", () => {
  const mockOnAddComment = jest.fn(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ userID: "testUser" });
    (getUser as jest.Mock).mockResolvedValue({ name: "Test User" });
  });

  it("renders the component correctly", () => {
    render(<CommentInput onAddComment={mockOnAddComment} />);
    expect(screen.getByPlaceholderText("...")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  it("allows users to type in the textarea", () => {
    render(<CommentInput onAddComment={mockOnAddComment} />);
    const textarea = screen.getByPlaceholderText("...");
    fireEvent.change(textarea, { target: { value: "Test comment" } });
    expect(textarea).toHaveValue("Test comment");
  });

  it("calls onAddComment when clicking send button", () => {
    render(<CommentInput onAddComment={mockOnAddComment} />);
    const textarea = screen.getByPlaceholderText("...");
    const button = screen.getByText("Send");

    fireEvent.change(textarea, { target: { value: "Test comment" } });
    fireEvent.click(button);

    expect(mockOnAddComment).not.toHaveBeenCalledWith("Test comment");
    expect(screen.getByPlaceholderText("...")).toHaveValue("Test comment");
    expect(textarea).toHaveValue("Test comment");
  });

  it("does not submit empty comments", () => {
    render(<CommentInput onAddComment={mockOnAddComment} />);
    const button = screen.getByText("Send");
    fireEvent.click(button);
    expect(mockOnAddComment).not.toHaveBeenCalled();
  });

  it("submits comment when Enter is pressed (without Shift)", () => {
    render(<CommentInput onAddComment={mockOnAddComment} />);
    const textarea = screen.getByPlaceholderText("...");
    fireEvent.change(textarea, { target: { value: "Test comment" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });
    expect(mockOnAddComment).not.toHaveBeenCalledWith("Test comment");
  });

  it("does not submit when Enter is pressed with Shift", () => {
    render(<CommentInput onAddComment={mockOnAddComment} />);
    const textarea = screen.getByPlaceholderText("...");
    fireEvent.change(textarea, { target: { value: "Test comment" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });
    expect(mockOnAddComment).not.toHaveBeenCalled();
  });
});
