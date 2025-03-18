import React from "react";
import { render, screen } from "@testing-library/react";
import ProfileInfo from "@/components/profile/ProfileInfo";
import { useTranslations } from "next-intl";
import "@testing-library/jest-dom";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(),
}));

describe("ProfileInfo Component", () => {
  const mockTranslations = {
    statistics: "Statistics",
    organized: "Events Organized",
    enrolled: "Events Enrolled",
    invitedTo: "Invited To",
  };

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(
      (key: keyof typeof mockTranslations) => mockTranslations[key]
    );
  });

  it("renders the title correctly", () => {
    render(<ProfileInfo />);
    expect(screen.getByText(mockTranslations.statistics)).toBeInTheDocument();
  });

  it("renders the statistics correctly with default values", () => {
    render(<ProfileInfo />);

    expect(screen.getByText(mockTranslations.organized)).toBeInTheDocument();
    expect(screen.getAllByText("0")[0]).toBeInTheDocument();

    expect(screen.getByText(mockTranslations.enrolled)).toBeInTheDocument();
    expect(screen.getAllByText("0")[1]).toBeInTheDocument();

    expect(screen.getByText(mockTranslations.invitedTo)).toBeInTheDocument();
    expect(screen.getAllByText("0")[2]).toBeInTheDocument();
  });
});
