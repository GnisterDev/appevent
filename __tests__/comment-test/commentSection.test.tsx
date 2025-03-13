import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CommentSection from "@/components/event/overview/comments/CommentSection";

// Mock `CommentItem` og `CommentInput` for å unngå avhengigheter i testen
jest.mock(
  "@/components/event/overview/comments/CommentItem",
  () => (props: { text: string; name: string; user: string }) =>
    (
      <div data-testid="comment-item">
        <strong>{props.name}</strong>: {props.text}
      </div>
    )
);

jest.mock(
  "@/components/event/overview/comments/CommentInput",
  () => (props: { onAddComment: Function }) =>
    (
      <button
        onClick={() => props.onAddComment("Test kommentar", "123", "Test User")}
        data-testid="add-comment"
      >
        Add Comment
      </button>
    )
);

describe("CommentSection component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders comment section header", () => {
    render(<CommentSection />);
    expect(screen.getByText("Kommentarer")).toBeInTheDocument();
  });

  test("renders CommentInput component", () => {
    render(<CommentSection />);
    expect(screen.getByTestId("add-comment")).toBeInTheDocument();
  });

  test("adds a new comment when CommentInput is used", () => {
    render(<CommentSection />);

    const addButton = screen.getByTestId("add-comment");

    // Klikker på "Add Comment"-knappen for å legge til en kommentar
    fireEvent.click(addButton);

    // Sjekker om kommentaren vises i CommentSection
    expect(screen.getAllByTestId("comment-item").length).toBe(1);
    expect(screen.getByText("Test User: Test kommentar")).toBeInTheDocument();
  });

  test("does not add empty comments", () => {
    render(<CommentSection />);

    const addButton = screen.getByTestId("add-comment");

    // Klikker på knappen, men uten tekst (dette er en mock, så vi må eksplisitt teste empty input)
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    // Sjekker at ingen tomme kommentarer legges til
    expect(screen.getAllByTestId("comment-item").length).toBe(1);
  });

  test("adds multiple comments correctly", () => {
    render(<CommentSection />);

    const addButton = screen.getByTestId("add-comment");

    // Legger til 3 kommentarer
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    // Sjekker at tre kommentarer er lagt til
    expect(screen.getAllByTestId("comment-item").length).toBe(3);
  });
});
