import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { createEvent, inviteUsersToEvent } from "@/firebase/DatabaseService";
import CreateEventForm from "@/app/event/create/page";
import { DefaultEventData } from "@/firebase/Event";

jest.mock("@/firebase/DatabaseService", () => ({
  createEvent: jest.fn(),
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

describe("CreateEventForm", () => {
  const mockRouterPush = jest.fn();
  const mockRouterBack = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      back: mockRouterBack,
    });
    jest.clearAllMocks();
  });

  it("renders the form with all components", () => {
    render(<CreateEventForm />);

    expect(screen.getByText("createTitle")).toBeInTheDocument();
    expect(screen.getByText("BaseInformation Component")).toBeInTheDocument();
    expect(screen.getByText("Details Component")).toBeInTheDocument();
  });

  it("calls createEvent and inviteUsersToEvent on form submission", async () => {
    (createEvent as jest.Mock).mockResolvedValue("event123");
    (inviteUsersToEvent as jest.Mock).mockResolvedValue(undefined);

    render(<CreateEventForm />);

    const submitButton = screen.getByText("createEventButton");
    fireEvent.click(submitButton);

    expect(createEvent).toHaveBeenCalledWith(DefaultEventData);
    await screen.findByText("createEventButton"); // Wait for async actions
    expect(inviteUsersToEvent).toHaveBeenCalledWith("event123", []);
    expect(mockRouterPush).toHaveBeenCalledWith("/event/event123");
  });

  it("navigates back when cancel button is clicked", () => {
    render(<CreateEventForm />);

    const cancelButton = screen.getByText("cancelButton");
    fireEvent.click(cancelButton);

    expect(mockRouterBack).toHaveBeenCalled();
  });
});
