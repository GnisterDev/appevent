import React from "react";
import { render, screen } from "@testing-library/react";
import { UserDisplayContext } from "@/firebase/contexts";
import Interests from "@/components/profile/Interests";
import { useTranslations } from "next-intl";
import "@testing-library/jest-dom";
import { DefaultUserData, UserData } from "@/firebase/User";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(),
}));

jest.mock("@/components/event/Tag", () =>
  jest.fn(() => <div data-testid="tag" />)
);

describe("Interests Component", () => {
  const mockTranslations = {
    intrests: "Interests",
    noIntrests: "No interests available",
  };

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(
      (key: keyof typeof mockTranslations) => mockTranslations[key]
    );
  });

  const renderWithContext = (userData: UserData) => {
    return render(
      <UserDisplayContext.Provider
        value={{
          userID: "testUserID",
          userData: userData,
          updateInvitedEvents: jest.fn(),
        }}
      >
        <Interests />
      </UserDisplayContext.Provider>
    );
  };

  it("renders the title with the correct text", () => {
    const mockUserData = { ...DefaultUserData, interests: [] };
    renderWithContext(mockUserData);

    expect(screen.getByText(mockTranslations.intrests)).toBeInTheDocument();
  });

  it("renders the interests as tags when userData has interests", () => {
    const mockUserData = {
      ...DefaultUserData,
      interests: ["Music", "Travel", "Coding"],
    };
    renderWithContext(mockUserData);

    expect(screen.getAllByTestId("tag")).toHaveLength(
      mockUserData.interests.length
    );
  });

  it("renders the no interests message when userData has no interests", () => {
    const mockUserData = { ...DefaultUserData, interests: [] };
    renderWithContext(mockUserData);

    expect(screen.getByText(mockTranslations.noIntrests)).toBeInTheDocument();
  });
});
