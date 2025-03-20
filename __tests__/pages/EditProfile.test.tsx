import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserEdit from "@/app/profile/[id]/edit/page";
import { useRouter, useParams } from "next/navigation";
import { getUser, changeUser } from "@/firebase/DatabaseService";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@/firebase/DatabaseService", () => ({
  getUser: jest.fn(),
  changeUser: jest.fn(),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/components/Loading", () => {
  const MockLoading = () => <div>Loading...</div>;
  MockLoading.displayName = "MockLoading";
  return MockLoading;
});
jest.mock("@/components/profile/edit/PersonalInformation", () => {
  const MockPersonalInformation = () => (
    <div>PersonalInformation Component</div>
  );
  MockPersonalInformation.displayName = "MockPersonalInformation";
  return MockPersonalInformation;
});
jest.mock("@/components/profile/edit/InterestsEdit", () => {
  const MockInterestsEdit = () => <div>InterestsEdit Component</div>;
  MockInterestsEdit.displayName = "MockInterestsEdit";
  return MockInterestsEdit;
});

describe("UserEdit Component", () => {
  const mockRouterPush = jest.fn();
  const mockRouterBack = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      back: mockRouterBack,
    });
    (useParams as jest.Mock).mockReturnValue({ id: "123" });
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    (getUser as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<UserEdit />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state and redirects to 404 if userID is not found", async () => {
    (useParams as jest.Mock).mockReturnValue({ id: null });
    render(<UserEdit />);
    await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith("/404"));
  });

  it("fetches user data and renders the form", async () => {
    const mockUserData = { name: "John Doe", email: "john@example.com" };
    (getUser as jest.Mock).mockResolvedValue(mockUserData);

    render(<UserEdit />);

    await waitFor(() => {
      expect(screen.getByText("editProfile")).toBeInTheDocument();
      expect(
        screen.getByText("PersonalInformation Component")
      ).toBeInTheDocument();
      expect(screen.getByText("InterestsEdit Component")).toBeInTheDocument();
    });
  });

  it("handles form submission and redirects to the profile page", async () => {
    const mockUserData = { name: "John Doe", email: "john@example.com" };
    (getUser as jest.Mock).mockResolvedValue(mockUserData);
    (changeUser as jest.Mock).mockResolvedValue(undefined);

    render(<UserEdit />);

    await waitFor(() => {
      expect(screen.getByText("editProfile")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("saveChanges"));

    await waitFor(() => {
      expect(changeUser).toHaveBeenCalledWith("123", mockUserData);
      expect(mockRouterPush).toHaveBeenCalledWith("/profile/123");
    });
  });

  it("handles cancel button click and navigates back", async () => {
    const mockUserData = { name: "John Doe", email: "john@example.com" };
    (getUser as jest.Mock).mockResolvedValue(mockUserData);
    render(<UserEdit />);

    await waitFor(() => {
      expect(screen.getByText("editProfile")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("cancel"));
    expect(mockRouterBack).toHaveBeenCalled();
  });
});
