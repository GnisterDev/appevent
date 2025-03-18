import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EventEdit from "@/app/event/[id]/edit/page";
import { useRouter, useParams } from "next/navigation";
import {
  getAllInvited,
  getEvent,
  cancelEventInvitation,
  changeEvent,
  inviteUsersToEvent,
} from "@/firebase/DatabaseService";
import { DefaultEventData } from "@/firebase/Event";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock("@/firebase/DatabaseService", () => ({
  getAllInvited: jest.fn(),
  getEvent: jest.fn(),
  cancelEventInvitation: jest.fn(),
  changeEvent: jest.fn(),
  inviteUsersToEvent: jest.fn(),
}));
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));
jest.mock("@/components/event/create/BaseInformation", () => {
  const MockBaseInformation = () => <div>BaseInformation Component</div>;
  MockBaseInformation.displayName = "BaseInformation";
  return MockBaseInformation;
});
jest.mock("@/components/event/create/Details", () => {
  const MockDetails = () => <div>Details Component</div>;
  MockDetails.displayName = "Details";
  return MockDetails;
});
jest.mock("@/components/event/create/Invites", () => {
  const MockInvites = () => <div>Invites Component</div>;
  MockInvites.displayName = "Invites";
  return MockInvites;
});
jest.mock("@/components/Loading", () => {
  const MockLoading = () => <div>Loading...</div>;
  MockLoading.displayName = "Loading";
  return MockLoading;
});

describe("EventEdit", () => {
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
    (getEvent as jest.Mock).mockResolvedValue(DefaultEventData);
    (getAllInvited as jest.Mock).mockResolvedValue([]);

    render(<EventEdit />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state when event ID is not found", async () => {
    (useParams as jest.Mock).mockReturnValue({ id: undefined });

    render(<EventEdit />);
    await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith("/404"));
  });

  it("renders the form with event data", async () => {
    (getEvent as jest.Mock).mockResolvedValue(DefaultEventData);
    (getAllInvited as jest.Mock).mockResolvedValue([]);

    render(<EventEdit />);
    await waitFor(() =>
      expect(screen.getByText("editTitle")).toBeInTheDocument()
    );
    expect(screen.getByText("BaseInformation Component")).toBeInTheDocument();
    expect(screen.getByText("Details Component")).toBeInTheDocument();
  });

  it("handles form submission and updates event", async () => {
    (getEvent as jest.Mock).mockResolvedValue(DefaultEventData);
    (getAllInvited as jest.Mock).mockResolvedValue([{ userID: "user1" }]);
    (cancelEventInvitation as jest.Mock).mockResolvedValue(undefined);
    (inviteUsersToEvent as jest.Mock).mockResolvedValue(undefined);
    (changeEvent as jest.Mock).mockResolvedValue(undefined);

    render(<EventEdit />);
    await waitFor(() =>
      expect(screen.getByText("editTitle")).toBeInTheDocument()
    );

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() =>
      expect(changeEvent).toHaveBeenCalledWith("123", DefaultEventData)
    );
    expect(mockRouterPush).toHaveBeenCalledWith("/event/123");
  });

  it("handles cancel button click", async () => {
    (getEvent as jest.Mock).mockResolvedValue(DefaultEventData);
    (getAllInvited as jest.Mock).mockResolvedValue([]);

    render(<EventEdit />);
    await waitFor(() =>
      expect(screen.getByText("editTitle")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("cancelButton"));
    expect(mockRouterBack).toHaveBeenCalled();
  });
});
