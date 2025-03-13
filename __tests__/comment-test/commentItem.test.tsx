import React from "react";
import { render, screen } from "@testing-library/react";
import CommentItem from "@/components/event/overview/comments/CommentItem";

describe("CommentItem component", () => {
  const testProps = {
    user: "user123",
    name: "Test User",
    text: "This is a test comment.",
  };

  test("renders the comment with correct text and name", () => {
    render(<CommentItem {...testProps} />);

    // Sjekker at navnet vises
    expect(screen.getByText(testProps.name)).toBeInTheDocument();

    // Sjekker at kommentaren vises
    expect(screen.getByText(testProps.text)).toBeInTheDocument();
  });

  test("applies correct CSS classes", () => {
    render(<CommentItem {...testProps} />);

    // Sjekker at navnet har riktig CSS-klasse
    expect(screen.getByText(testProps.name)).toHaveClass("commentUser");

    // Sjekker at kommentaren har riktig CSS-klasse
    expect(screen.getByText(testProps.text)).toHaveClass("commentText");
  });
});
