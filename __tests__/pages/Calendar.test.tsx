import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Calendar from "@/app/calendar/page";
import { useAuth } from "@/firebase/AuthService";
import { getEventsByRole } from "@/firebase/DatabaseService";
import { DefaultListEvents, EventData } from "@/firebase/Event";
import { useTranslations } from "next-intl";

jest.mock("@/firebase/AuthService", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/firebase/DatabaseService", () => ({
  getEventsByRole: jest.fn(),
}));

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(),
}));

jest.mock("@/components/calendar/EventList", () => ({
  __esModule: true,
  default: ({ events }: { events: EventData[] }) => (
    <div data-testid="event-list">{events.length} events</div>
  ),
}));

describe("Calendar Component", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ userID: "test-user" });
    (useTranslations as jest.Mock).mockReturnValue((key: string) => key);
    (getEventsByRole as jest.Mock).mockResolvedValue(DefaultListEvents);
  });

  it("renders the Calendar component", async () => {
    render(<Calendar />);
    expect(screen.getByText("myEvents")).toBeInTheDocument();
  });

  it("displays registered events when available", async () => {
    (getEventsByRole as jest.Mock).mockResolvedValue({
      ...DefaultListEvents,
      registered: [{ id: 1, name: "Registered Event" }],
    });

    render(<Calendar />);

    await waitFor(() => {
      expect(screen.getByText("registeredEvents")).toBeInTheDocument();
      expect(screen.getByTestId("event-list")).toHaveTextContent("1 events");
    });
  });

  it("displays organized events when available", async () => {
    (getEventsByRole as jest.Mock).mockResolvedValue({
      ...DefaultListEvents,
      organizer: [{ id: 2, name: "Organized Event" }],
    });

    render(<Calendar />);

    await waitFor(() => {
      expect(screen.getByText("organizedEvents")).toBeInTheDocument();
      expect(screen.getByTestId("event-list")).toHaveTextContent("1 events");
    });
  });

  it("displays invited events when available", async () => {
    (getEventsByRole as jest.Mock).mockResolvedValue({
      ...DefaultListEvents,
      invited: [{ id: 3, name: "Invited Event" }],
    });

    render(<Calendar />);

    await waitFor(() => {
      expect(screen.getByText("invitedEvents")).toBeInTheDocument();
      expect(screen.getByTestId("event-list")).toHaveTextContent("1 events");
    });
  });

  it("does not display event sections when no events are available", async () => {
    render(<Calendar />);

    await waitFor(() => {
      expect(screen.queryByText("registeredEvents")).not.toBeInTheDocument();
      expect(screen.queryByText("organizedEvents")).not.toBeInTheDocument();
      expect(screen.queryByText("invitedEvents")).not.toBeInTheDocument();
    });
  });
});
