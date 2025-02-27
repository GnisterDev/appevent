import React from "react";
import { render, screen } from "@testing-library/react";
import Participant from "@/components/event/overview/partcipant/Participant";

jest.mock("participant.module.css", () => ({
  participant: "participant",
  name: "name",
  icon: "icon",
}));

describe("Participant Component", () => {
  it("renders correctly with the provided name", () => {
    render(<Participant name="John Doe" />);

    // Check if the name is rendered correctly
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Check if the div that would contain the UserMinus icon exists
    const iconContainer = screen
      .getByText("John Doe")
      .parentElement?.querySelector(".icon");
    expect(iconContainer).toBeInTheDocument();
  });

  it("applies the correct CSS classes", () => {
    const { container } = render(<Participant name="John Doe" />);

    // Check if the main div has the participant class
    const participantDiv = container.firstChild;
    expect(participantDiv).toHaveClass("participant");

    // Check if the name paragraph has the name class
    const nameElement = screen.getByText("John Doe");
    expect(nameElement).toHaveClass("name");

    // Check if the icon div has the icon class
    const iconDiv = container.querySelector("div.icon");
    expect(iconDiv).toBeInTheDocument();
  });

  it("contains a UserMinus icon", () => {
    render(<Participant name="John Doe" />);

    // Since we've mocked UserMinus to render a div with the test id,
    // we can check if our mock was rendered
    const userMinusIconMock = screen.queryByTestId("user-minus-icon");
    expect(userMinusIconMock).toBeInTheDocument();
  });

  it("renders different names correctly", () => {
    const { rerender } = render(<Participant name="John Doe" />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    rerender(<Participant name="Jane Smith" />);
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });
});
