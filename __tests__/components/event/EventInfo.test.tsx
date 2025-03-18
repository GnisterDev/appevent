import React from "react";
import { render, screen } from "@/test-utils";
import EventInfo from "@/components/event/overview/EventInfo";
import { EventDisplayContext } from "@/firebase/contexts";
import messages from "messages/no.json";
import { EventData } from "@/firebase/Event";
import { DocumentReference, Timestamp } from "firebase/firestore";

jest.mock("@/components/event/Tag", () => {
  return function MockTag({ text }: { text: string }) {
    return <div data-testid={`tag-${text}`}>{text}</div>;
  };
});

describe("EventInfo", () => {
  const translations = {
    about: messages.Event.Info.about,
  };

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

    expect(screen.getByText(mockEventData.title)).toBeInTheDocument();
    expect(screen.getByText(mockEventData.location)).toBeInTheDocument();
    expect(
      screen.getByText(mockEventData.participants.length.toString())
    ).toBeInTheDocument();
    expect(screen.getByText(mockEventData.description)).toBeInTheDocument();
    expect(screen.getByText(translations.about)).toBeInTheDocument();
  });

  it("renders all event tags", () => {
    renderWithContext();
    mockEventData.tags.forEach(tag => {
      expect(screen.getByTestId(`tag-${tag}`)).toBeInTheDocument();
    });
  });

  it("formats the date correctly", () => {
    renderWithContext();
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
          eventID: "",
          participants: [],
          isOrg: false,
          refreshInfo: async () => Promise.resolve(),
        }}
      >
        <EventInfo />
      </EventDisplayContext.Provider>
    );

    expect(container.firstChild).toBeNull();
  });
});
