import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Details from "@/components/event/create/Details";
import { EventContext, EventData } from "@/firebase/Event";
import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";

// Mock the Tag component
jest.mock("@/components/event/Tag", () => {
  return {
    __esModule: true,
    default: ({ text, onDelete }: { text: string; onDelete: () => void }) => (
      <div data-testid={`tag-${text}`} className="mock-tag">
        {text}
        <button data-testid={`delete-tag-${text}`} onClick={onDelete}>
          Delete
        </button>
      </div>
    ),
  };
});

describe("Details Component", () => {
  // Setup mock context values and wrapper
  const mockUpdateFormData = jest.fn();
  const defaultFormData: EventData = {
    title: "Test Event",
    description: "Test description",
    startTime: "" as unknown as Timestamp,
    location: "Test Location",
    organizer: {
      id: "test-organizer-id",
    } as unknown as DocumentReference<DocumentData>,
    tags: ["react", "testing"],
    participants: [],
    private: false,
    type: "Test type",
  };

  const renderWithContext = (formData = defaultFormData) => {
    return render(
      <EventContext.Provider
        value={{ formData, updateFormData: mockUpdateFormData }}
      >
        <Details />
      </EventContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the component with correct initial values", () => {
    renderWithContext();

    // Check description
    expect(screen.getByPlaceholderText("Fortell om arrangementet")).toHaveValue(
      "Test description"
    );

    // Check tags
    expect(screen.getByTestId("tag-react")).toBeInTheDocument();
    expect(screen.getByTestId("tag-testing")).toBeInTheDocument();
  });

  test("updates description when textarea changes", () => {
    renderWithContext();

    const descriptionTextarea = screen.getByPlaceholderText(
      "Fortell om arrangementet"
    );
    fireEvent.change(descriptionTextarea, {
      target: { value: "New description text" },
    });

    expect(mockUpdateFormData).toHaveBeenCalledWith(
      "description",
      "New description text"
    );
  });

  test("adds a new tag when Enter is pressed", () => {
    renderWithContext();

    const tagInput = screen.getByPlaceholderText(
      "Skriv merkelapp ogg trykk Enter"
    );

    // Type a new tag and press Enter
    fireEvent.change(tagInput, { target: { value: "jest" } });
    fireEvent.keyDown(tagInput, { key: "Enter" });

    // Check if updateFormData was called with the new tag added to the existing ones
    expect(mockUpdateFormData).toHaveBeenCalledWith("tags", [
      "react",
      "testing",
      "jest",
    ]);

    // Input should be cleared after adding
    expect(tagInput).toHaveValue("");
  });

  test("doesn't add a tag if input is empty", () => {
    renderWithContext();

    const tagInput = screen.getByPlaceholderText(
      "Skriv merkelapp ogg trykk Enter"
    );

    // Press Enter with empty input
    fireEvent.keyDown(tagInput, { key: "Enter" });

    // updateFormData should not be called
    expect(mockUpdateFormData).not.toHaveBeenCalled();
  });

  test("doesn't add a tag if it only contains whitespace", () => {
    renderWithContext();

    const tagInput = screen.getByPlaceholderText(
      "Skriv merkelapp ogg trykk Enter"
    );

    // Type spaces and press Enter
    fireEvent.change(tagInput, { target: { value: "   " } });
    fireEvent.keyDown(tagInput, { key: "Enter" });

    // updateFormData should not be called
    expect(mockUpdateFormData).not.toHaveBeenCalled();
  });

  test("doesn't add a tag if it's a duplicate", () => {
    renderWithContext();

    const tagInput = screen.getByPlaceholderText(
      "Skriv merkelapp ogg trykk Enter"
    );

    // Type an existing tag and press Enter
    fireEvent.change(tagInput, { target: { value: "react" } });
    fireEvent.keyDown(tagInput, { key: "Enter" });

    // updateFormData should not be called
    expect(mockUpdateFormData).not.toHaveBeenCalled();
  });

  test("doesn't add a tag when a key other than Enter is pressed", () => {
    renderWithContext();

    const tagInput = screen.getByPlaceholderText(
      "Skriv merkelapp ogg trykk Enter"
    );

    // Type a tag and press a key other than Enter
    fireEvent.change(tagInput, { target: { value: "new-tag" } });
    fireEvent.keyDown(tagInput, { key: "Tab" });

    // updateFormData should not be called
    expect(mockUpdateFormData).not.toHaveBeenCalled();
    expect(tagInput).toHaveValue("new-tag");
  });

  test("deletes a tag when delete button is clicked", () => {
    renderWithContext();

    // Click delete button on the "react" tag
    const deleteButton = screen.getByTestId("delete-tag-react");
    fireEvent.click(deleteButton);

    // Check if updateFormData was called with the filtered array
    expect(mockUpdateFormData).toHaveBeenCalledWith("tags", ["testing"]);
  });

  test("trims whitespace from tags before adding them", () => {
    renderWithContext();

    const tagInput = screen.getByPlaceholderText(
      "Skriv merkelapp ogg trykk Enter"
    );

    // Type a tag with whitespace and press Enter
    fireEvent.change(tagInput, { target: { value: "  new-tag  " } });
    fireEvent.keyDown(tagInput, { key: "Enter" });

    // Check if updateFormData was called with the trimmed tag
    expect(mockUpdateFormData).toHaveBeenCalledWith("tags", [
      "react",
      "testing",
      "new-tag",
    ]);
  });

  test("renders with empty tags array", () => {
    const emptyTagsFormData = {
      ...defaultFormData,
      tags: [],
    };

    renderWithContext(emptyTagsFormData);

    // Should render without errors
    expect(screen.getByText("Detaljer")).toBeInTheDocument();
    expect(screen.queryByTestId(/tag-/)).not.toBeInTheDocument();
  });
});
