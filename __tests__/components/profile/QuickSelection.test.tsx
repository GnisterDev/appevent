import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuickSelection from "@/components/profile/QuickSelection";
import { UserDisplayContext } from "@/firebase/contexts";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { DefaultUserData } from "@/firebase/User";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(),
}));

describe("QuickSelection Component", () => {
  const mockTranslations = {
    quickSelection: "Quick Selection",
    myCalendar: "My Calendar",
    settings: "Settings",
    logout: "Logout",
  };

  const mockPush = jest.fn();

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(
      (key: keyof typeof mockTranslations) => mockTranslations[key]
    );

    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  const renderWithContext = (userID = "testUserID") => {
    return render(
      <UserDisplayContext.Provider
        value={{
          userID,
          userData: DefaultUserData,
          updateInvitedEvents: () => Promise.resolve(),
        }}
      >
        <QuickSelection />
      </UserDisplayContext.Provider>
    );
  };

  it("renders all buttons with correct text", () => {
    renderWithContext();

    expect(
      screen.getByText(mockTranslations.quickSelection)
    ).toBeInTheDocument();
    expect(screen.getByText(mockTranslations.myCalendar)).toBeInTheDocument();
    expect(screen.getByText(mockTranslations.settings)).toBeInTheDocument();
    expect(screen.getByText(mockTranslations.logout)).toBeInTheDocument();
  });

  it("navigates to the calendar when My Calendar button is clicked", () => {
    renderWithContext();

    fireEvent.click(screen.getByText(mockTranslations.myCalendar));
    expect(mockPush).toHaveBeenCalledWith("/calendar");
  });

  it("navigates to user settings when Settings button is clicked", () => {
    renderWithContext("user123");

    fireEvent.click(screen.getByText(mockTranslations.settings));
    expect(mockPush).toHaveBeenCalledWith("user123/edit");
  });
});
