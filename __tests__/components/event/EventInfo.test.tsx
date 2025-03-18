import React from "react";
import { render, screen } from "@/test-utils";
import EventInfo from "@/components/event/overview/EventInfo";
import { EventDisplayContext } from "@/firebase/contexts";
import messages from "messages/no.json";
import { EventData } from "@/firebase/Event";
import { DocumentReference, Timestamp } from "firebase/firestore";

// Mock the Tag component
jest.mock("@/components/event/Tag", () => {
  return function MockTag({ text }: { text: string }) {
    return <div data-testid={`tag-${text}`}>{text}</div>;
  };
});

describe("EventInfo", () => {
  // Get the actual translated strings from the messages file
  const translations = {
    about: messages.Event.Info.about,
  };

  // Mock event data
  const mockEventData: EventData = {
    eventID: "event123",
    title: "Test Event",
    description: "This is a test event description.",
    location: "Oslo, Norway",
    startTime: {
      toDate: () => new Date(),
    } as unknown as Timestamp,
    participants: [],
    tags: ["technology", "networking", "conference"],
    type: "Example type",
    private: false,
    organizer: null as unknown as DocumentReference,
    comments: [],
  };

  const renderWithContext = (eventData = mockEventData) => {
    return render(
      <EventDisplayContext.Provider
        value={{
          eventData,
          eventID: eventData?.eventID || "",
          participants: [],
          isOrg: false,
          refreshInfo: async () => Promise.resolve(),
        }}
      >
        <EventInfo />
      </EventDisplayContext.Provider>
    );
  };

  it("renders the event information correctly", () => {
    renderWithContext();

    // Check if event title is rendered
    expect(screen.getByText(mockEventData.title)).toBeInTheDocument();

    // Check if location is rendered
    expect(screen.getByText(mockEventData.location)).toBeInTheDocument();

    // Check if participant count is rendered
    expect(
      screen.getByText(mockEventData.participants.length.toString())
    ).toBeInTheDocument();

    // Check if description is rendered
    expect(screen.getByText(mockEventData.description)).toBeInTheDocument();

    // Check if about title is rendered
    expect(screen.getByText(translations.about)).toBeInTheDocument();
  });

  it("renders all event tags", () => {
    renderWithContext();

    // Check if all tags are rendered
    mockEventData.tags.forEach(tag => {
      expect(screen.getByTestId(`tag-${tag}`)).toBeInTheDocument();
    });
  });

  it("formats the date correctly", () => {
    renderWithContext();

    // The locale string format for the given date (adjust based on your exact locale format)
    const expectedDateFormat = new Date(mockEventData.startTime.toDate())
      .toLocaleString("no-nb", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replaceAll(".", "/")
      .replaceAll(",", "");

    expect(screen.getByText(expectedDateFormat)).toBeInTheDocument();
  });

  it("does not render anything when eventData is null", () => {
    const { container } = render(
      <EventDisplayContext.Provider
        value={{
          eventData: null,
          eventID: null,
          participants: [],
          isOrg: false,
          refreshInfo: async () => Promise.resolve(),
        }}
      >
        <EventInfo />
      </EventDisplayContext.Provider>
    );

    // Container should be empty
    expect(container.firstChild).toBeNull();
  });
});
