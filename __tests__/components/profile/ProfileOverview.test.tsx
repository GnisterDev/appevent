import React from "react";
import { render, screen } from "@testing-library/react";
import ProfileOverview from "@/components/profile/ProfileOverview";
import { UserDisplayContext } from "@/firebase/contexts";
import { useAuth, isAdministrator } from "@/firebase/AuthService";
import "@testing-library/jest-dom";
import { UserData } from "@/firebase/User";

jest.mock("@/firebase/AuthService", () => ({
  useAuth: jest.fn(),
  isAdministrator: jest.fn(),
}));

describe("ProfileOverview Component", () => {
  const mockUserData: UserData = {
    userID: "testUser",
    name: "Test User",
    email: "test@example.com",
    location: "Test Location",
    description: "",
    interests: [],
    invitations: [],
    type: "user",
  };

  const renderWithContext = (
    userData = mockUserData,
    admin = false,
    authUserID = "testUser"
  ) => {
    (useAuth as jest.Mock).mockReturnValue({ userID: authUserID });
    (isAdministrator as jest.Mock).mockReturnValue(admin);

    return render(
      <UserDisplayContext.Provider
        value={{
          userID: "",
          userData,
          updateInvitedEvents: async () => Promise.resolve(),
        }}
      >
        <ProfileOverview />
      </UserDisplayContext.Provider>
    );
  };

  it("renders user information correctly", () => {
    renderWithContext();
    expect(screen.getByText(mockUserData.name)).toBeInTheDocument();
    expect(screen.getByText(mockUserData.email)).toBeInTheDocument();
    expect(screen.getByText(mockUserData.location)).toBeInTheDocument();
  });

  it("does not show delete button when viewing own profile", () => {
    renderWithContext();
    expect(screen.queryByText("Slett Bruker")).not.toBeInTheDocument();
  });

  it("shows delete button for an admin viewing another user's profile", () => {
    renderWithContext(mockUserData, true, "adminUser");
    expect(screen.getByText("Slett Bruker")).toBeInTheDocument();
  });

  it("does not show delete button if not an admin", () => {
    renderWithContext(mockUserData, false, "anotherUser");
    expect(screen.queryByText("Slett Bruker")).not.toBeInTheDocument();
  });
});
