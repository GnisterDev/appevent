import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/firebase/AuthService";
import { getUser } from "@/firebase/DatabaseService";
import ProfilePage from "@/app/profile/[id]/page";
import { DefaultUserData } from "@/firebase/User";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock("@/firebase/AuthService", () => ({
  useAuth: jest.fn(),
}));
jest.mock("@/firebase/DatabaseService", () => ({
  getUser: jest.fn(),
}));
jest.mock("@/components/Loading", () => {
  const MockLoading = () => <div>Loading...</div>;
  MockLoading.displayName = "MockLoading";
  return MockLoading;
});
jest.mock("@/components/profile/ProfileOverview", () => {
  const MockProfileOverview = () => <div>ProfileOverview</div>;
  MockProfileOverview.displayName = "MockProfileOverview";
  return MockProfileOverview;
});
jest.mock("@/components/profile/ProfileInfo", () => {
  const MockProfileInfo = () => <div>ProfileInfo</div>;
  MockProfileInfo.displayName = "MockProfileInfo";
  return MockProfileInfo;
});
jest.mock("@/components/profile/QuickSelection", () => {
  const MockQuickSelection = () => <div>QuickSelection</div>;
  MockQuickSelection.displayName = "MockQuickSelection";
  return MockQuickSelection;
});
jest.mock("@/components/profile/Interests", () => {
  const MockInterests = () => <div>Interests</div>;
  MockInterests.displayName = "MockInterests";
  return MockInterests;
});
jest.mock("@/components/profile/invitation/InvitationOverview", () => {
  const MockInvitationOverview = () => <div>InvitationOverview</div>;
  MockInvitationOverview.displayName = "MockInvitationOverview";
  return MockInvitationOverview;
});

describe("ProfilePage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useParams as jest.Mock).mockReturnValue({ id: "testUserId" });
    (useAuth as jest.Mock).mockReturnValue({ userID: "testUserId" });
    (getUser as jest.Mock).mockResolvedValue(DefaultUserData);
  });

  it("renders loading state initially", () => {
    render(<ProfilePage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("fetches user data and renders the profile page", async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(getUser).toHaveBeenCalledWith("testUserId");
    });

    expect(screen.getByText("ProfileOverview")).toBeInTheDocument();
    expect(screen.getByText("Interests")).toBeInTheDocument();
    expect(screen.getByText("ProfileInfo")).toBeInTheDocument();
  });

  it("redirects to 404 if user data fetch fails", async () => {
    (getUser as jest.Mock).mockRejectedValue(new Error("User not found"));

    render(<ProfilePage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/404");
    });
  });

  it("renders InvitationOverview if there are invitations", async () => {
    (getUser as jest.Mock).mockResolvedValue({
      ...DefaultUserData,
      invitations: [{ id: "event1" }],
    });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("InvitationOverview")).toBeInTheDocument();
    });
  });

  it("does not render InvitationOverview if there are no invitations", async () => {
    (getUser as jest.Mock).mockResolvedValue({
      ...DefaultUserData,
      invitations: [],
    });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.queryByText("InvitationOverview")).not.toBeInTheDocument();
    });
  });

  it("renders QuickSelection for the logged-in user's profile", async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("QuickSelection")).toBeInTheDocument();
    });
  });

  it("does not render QuickSelection for another user's profile", async () => {
    (useParams as jest.Mock).mockReturnValue({ id: "anotherUserId" });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.queryByText("QuickSelection")).not.toBeInTheDocument();
    });
  });
});
