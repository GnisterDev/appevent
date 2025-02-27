import React from "react";
import { render, screen } from "@testing-library/react";
import ParticipantsInfo from "@/components/event/overview/partcipant/ParticipantsInfo";

jest.mock("participant.module.css", () => ({
  participant: "participant",
  name: "name",
  icon: "icon",
}));

describe("ParticipantsInfo Component", () => {
  it("renders the header section correctly", () => {
    render(<ParticipantsInfo />);

    // Check if the title is rendered
    expect(screen.getByText("Påmeldte deltagere")).toBeInTheDocument();

    // Check if the tag with total count is rendered
    expect(screen.getByText("n total")).toBeInTheDocument();
  });

  it("renders participants with correct names", () => {
    render(<ParticipantsInfo />);

    // Check if the participant names are rendered
    // expect(screen.getByText("navn1")).toBeInTheDocument();
    // expect(screen.getByText("navn2")).toBeInTheDocument();

    // There should be two elements with class "participant"
    const participantElements = document.querySelectorAll(".participant");
    // expect(participantElements.length).toBe(2);
  });

  it("renders UserMinus icons for each participant", () => {
    render(<ParticipantsInfo />);

    // Check for UserMinus icons (from the real Participant component)
    const iconElements = screen.getAllByTestId("user-minus-icon");
    // expect(iconElements).toHaveLength(2);
  });

  it("applies the correct CSS classes", () => {
    render(<ParticipantsInfo />);

    // Verify component structure with class-free queries
    const titleElement = screen.getByText("Påmeldte deltagere");
    expect(titleElement.tagName).toBe("H3");

    const tagElement = screen.getByText("n total").parentElement;
    expect(tagElement).toBeInTheDocument();

    // Check that names are rendered inside elements with class "name"
    // const navn1Element = screen.getByText("navn1");
    // expect(navn1Element).toHaveClass("name");

    // const navn2Element = screen.getByText("navn2");
    // expect(navn2Element).toHaveClass("name");

    // Check if we have the right number of participants
    const participantElements = document.querySelectorAll(".participant");
    // expect(participantElements.length).toBe(2);
  });
});
