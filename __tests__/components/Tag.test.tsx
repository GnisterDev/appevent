import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Tag from "../../src/components/event/Tag";

jest.mock("lucide-react", () => ({
  X: jest.fn(() => <div>Mocked LoaderCircle</div>),
}));

describe("Tag Component", () => {
  test("renders with the provided text", () => {
    render(<Tag text="Example Tag" />);
    expect(screen.getByText("Example Tag")).toBeInTheDocument();
  });

  test("does not render delete button when onDelete is not provided", () => {
    render(<Tag text="Example Tag" />);
    expect(screen.queryByRole("img", { name: /x/i })).not.toBeInTheDocument();
  });

  test("renders delete button when onDelete is provided", () => {
    render(<Tag text="Example Tag" onDelete={() => {}} />);
    // The X component from lucide-react will render as an SVG, which typically has an img role
    const deleteButton = screen.getByText("Example Tag").nextSibling;
    expect(deleteButton).toBeInTheDocument();
  });

  test("calls onDelete when delete button is clicked", () => {
    const mockOnDelete = jest.fn();
    render(<Tag text="Example Tag" onDelete={mockOnDelete} />);

    const deleteContainer = screen
      .getByText("Example Tag")
      .parentElement?.querySelector("[class*='delete']");
    if (!deleteContainer) {
      throw new Error("Delete button container not found");
    }

    fireEvent.click(deleteContainer);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  test("applies the provided color as backgroundColor", () => {
    render(<Tag text="Example Tag" color="#ff0000" />);
    const tagElement = screen.getByText("Example Tag").parentElement;
    expect(tagElement).toHaveStyle("background-color: #ff0000");
  });

  test("applies default styling when no color is provided", () => {
    render(<Tag text="Example Tag" />);
    const tagElement = screen.getByText("Example Tag").parentElement;
    // We're not testing the actual default color as it comes from CSS modules
    expect(tagElement).toHaveClass("tag");
  });

  test("renders correctly with long text content", () => {
    const longText =
      "This is a very long tag text that might potentially cause layout issues if not handled properly";
    render(<Tag text={longText} />);
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  test("applies custom class name from the CSS module", () => {
    render(<Tag text="Example Tag" onDelete={() => {}} />);

    // Check that the main container has the tag class
    const tagElement = screen.getByText("Example Tag").parentElement;
    expect(tagElement).toHaveClass("tag");

    // Check that the delete button has the delete class
    const deleteContainer = tagElement?.querySelector("div");
    expect(deleteContainer).toHaveClass("delete");
  });
});
