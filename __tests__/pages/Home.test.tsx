import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config";
import Home from "@/app/page";
import { useTranslations } from "next-intl";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/firebase/config", () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
  },
}));

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(),
}));

jest.mock("@/components/Loading", () => {
  const MockLoading = () => <div>Loading...</div>;
  MockLoading.displayName = "MockLoading";
  return MockLoading;
});
jest.mock("@/components/eventSearch/EventSearch", () => {
  const MockEventSearch = () => <div>Event Search</div>;
  MockEventSearch.displayName = "MockEventSearch";
  return MockEventSearch;
});

describe("Home Page", () => {
  const mockPush = jest.fn();
  const mockUseTranslations = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useTranslations as jest.Mock).mockImplementation(
      () => mockUseTranslations
    );
    jest.clearAllMocks();
  });

  it("renders the Loading component while loading", () => {
    (auth.onAuthStateChanged as jest.Mock).mockImplementationOnce(callback => {
      callback(null); // Simulate no user
      return jest.fn();
    });

    render(<Home />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to /signin if no user is authenticated", async () => {
    (auth.onAuthStateChanged as jest.Mock).mockImplementationOnce(callback => {
      callback(null); // Simulate no user
      return jest.fn();
    });

    render(<Home />);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/signin"));
  });
});
