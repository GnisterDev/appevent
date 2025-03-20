import React from "react";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase/AuthService";
import ForwardToProfile from "@/app/profile/page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/firebase/AuthService", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/components/Loading", () => jest.fn(() => <div>Loading...</div>));

describe("ForwardToProfile", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders the Loading component", () => {
    (useAuth as jest.Mock).mockReturnValue({ userID: null });
    render(<ForwardToProfile />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to the user's profile when userID is available", () => {
    (useAuth as jest.Mock).mockReturnValue({ userID: "123" });
    render(<ForwardToProfile />);
    expect(mockPush).toHaveBeenCalledWith("/profile/123");
  });

  it("does not redirect if userID is not available", () => {
    (useAuth as jest.Mock).mockReturnValue({ userID: null });
    render(<ForwardToProfile />);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
