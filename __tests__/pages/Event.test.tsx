import React from "react";
import { render, screen, waitFor } from "@/test-utils";
import { useRouter, useParams } from "next/navigation";
import { getAllParticipants, getEvent } from "@/firebase/DatabaseService";
import EventView from "@/app/event/[id]/page";
import { EventDisplayContext } from "@/firebase/contexts";
import { DefaultEventData, EventData } from "@/firebase/Event";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock("@/firebase/DatabaseService", () => ({
  getAllParticipants: jest.fn(),
  getEvent: jest.fn(),
}));
jest.mock("@/components/Loading", () => {
  const MockLoading = () => <div>Loading...</div>;
  MockLoading.displayName = "MockLoading";
  return MockLoading;
});

jest.mock("@/components/event/overview/EventInfo", () => {
  const MockEventInfo = () => <div>Event Info</div>;
  MockEventInfo.displayName = "MockEventInfo";
  return MockEventInfo;
});

describe("EventView", () => {
  const mockRouterPush = jest.fn();
  const mockEventID = "test-event-id";

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (useParams as jest.Mock).mockReturnValue({ id: mockEventID });
  });

  it("renders loading state initially", () => {
    (getEvent as jest.Mock).mockResolvedValue(null);
    (getAllParticipants as jest.Mock).mockResolvedValue([]);
    render(<EventView />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to 404 if event ID is not found", async () => {
    (useParams as jest.Mock).mockReturnValue({ id: null });
    render(<EventView />);
    await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith("/404"));
  });

  it("handles errors when loading event data", async () => {
    (getEvent as jest.Mock).mockRejectedValue(new Error("Event load error"));
    render(<EventView />);
    await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith("/404"));
  });

  it("redirects to 404 if the event is private and the user is not a participant", async () => {
    const mockEventData: EventData = {
      ...DefaultEventData,
      title: "Private Event",
      private: true,
    };

    render(
      <EventDisplayContext.Provider
        value={{
          eventID: "1",
          eventData: mockEventData,
          isOrg: false,
          participants: [],
          refreshInfo: jest.fn(),
        }}
      >
        <EventView />
      </EventDisplayContext.Provider>
    );

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/404");
    });
  });
});
