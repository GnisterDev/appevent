import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import Participant from "@/components/event/overview/participant/Participant";

describe("Participant Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the participant's name", () => {
    render(<Participant name="John Doe" userID="123" />);
    const nameElement = screen.getByText("John Doe");
    expect(nameElement).toBeInTheDocument();
  });

  it("navigates to the correct profile page on click", () => {
    render(<Participant name="John Doe" userID="123" />);
    const nameElement = screen.getByText("John Doe");
    fireEvent.click(nameElement);
    expect(mockPush).toHaveBeenCalledWith("/profile/123");
  });

  it("applies the correct styles", () => {
    render(<Participant name="John Doe" userID="123" />);
    const nameElement = screen.getByText("John Doe");
    expect(nameElement).toHaveClass("name");
  });
});
