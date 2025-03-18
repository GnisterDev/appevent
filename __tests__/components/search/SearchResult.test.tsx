import React from "react";
import { render, screen } from "@/test-utils";
import SearchResult from "@/components/eventSearch/SearchResult";
import { EventData } from "@/firebase/Event";
import { DocumentReference, Timestamp } from "firebase/firestore";
import styles from "@/components/eventSearch/SearchResult.module.css";

// Mock the next/link component
jest.mock("next/link", () => {
  const MockNextLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  );
  MockNextLink.displayName = "MockNextLink";
  return MockNextLink;
});

// Mock the Tag component
jest.mock("@/components/event/Tag", () => {
  return function MockTag({ text }: { text: string }) {
    return <div data-testid={`tag-${text}`}>{text}</div>;
  };
});

// Mock the Button component
jest.mock("@/components/Button", () => {
  return function MockButton({ text }: { text: string }) {
    return <button data-testid="see-more-button">{text}</button>;
  };
});

describe("SearchResult", () => {
  const EVENT_DESCRIPTION_CUTOFF = 50;

  // Mock event data
  const mockEvent: EventData = {
    eventID: "event123",
    title: "Tech Conference 2024",
    description: "This is a tech conference.",
    location: "Oslo, Norway",
    startTime: Timestamp.fromDate(new Date("2024-01-01T10:00:00Z")),
    participants: [],
    tags: ["technology", "networking", "conference"],
    organizer: null as unknown as DocumentReference,
    private: false,
    type: "",
    comments: [],
  };

  // Mock event with longer description
  const mockEventLongDesc: EventData = {
    ...mockEvent,
    description:
      "This is a very long description that should be truncated because it exceeds the character limit defined for the event description in the search results component and we want to make sure it works properly for user experience.",
  };

  it("renders event information correctly", () => {
    render(<SearchResult event={mockEvent} />);

    // Check if title is rendered
    expect(screen.getByText(mockEvent.title)).toBeInTheDocument();

    // Check if location is rendered
    expect(screen.getByText(mockEvent.location)).toBeInTheDocument();

    // Check if participant count is rendered
    expect(
      screen.getByText(mockEvent.participants.length.toString())
    ).toBeInTheDocument();

    // Check if description is rendered
    expect(screen.getByText(mockEvent.description)).toBeInTheDocument();

    // Check if all tags are rendered
    mockEvent.tags.forEach(tag => {
      expect(screen.getByTestId(`tag-${tag}`)).toBeInTheDocument();
    });

    // Check if "Se mer" button is rendered
    expect(screen.getByTestId("see-more-button")).toBeInTheDocument();
    expect(screen.getByText("Se mer")).toBeInTheDocument();
  });

  it("formats the date correctly", () => {
    render(<SearchResult event={mockEvent} />);

    // The locale string format for the given date
    const expectedDateFormat = new Date(mockEvent.startTime.toDate())
      .toLocaleString("no-nb", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replaceAll(".", "/")
      .replaceAll(",", "");

    // Since the date appears twice (Calendar and Clock icons), we should find it twice
    const dateElements = screen.getAllByText(expectedDateFormat);
    expect(dateElements.length).toBe(2);
  });

  it("truncates long descriptions", () => {
    render(<SearchResult event={mockEventLongDesc} />);

    // Check if the description is truncated
    const truncatedDesc = `${mockEventLongDesc.description.substring(
      0,
      EVENT_DESCRIPTION_CUTOFF
    )}...`;
    expect(screen.getByText(truncatedDesc)).toBeInTheDocument();

    // Make sure the full description is not rendered
    expect(
      screen.queryByText(mockEventLongDesc.description)
    ).not.toBeInTheDocument();
  });

  it("does not truncate short descriptions", () => {
    render(<SearchResult event={mockEvent} />);

    // Check if the full description is rendered
    expect(screen.getByText(mockEvent.description)).toBeInTheDocument();

    // Make sure there's no truncated version
    const truncatedDesc = `${mockEvent.description.substring(
      0,
      EVENT_DESCRIPTION_CUTOFF
    )}...`;
    expect(screen.queryByText(truncatedDesc)).not.toBeInTheDocument();
  });

  it("creates correct link to event page", () => {
    render(<SearchResult event={mockEvent} />);

    // Check if the link has the correct href
    const link = screen.getByTestId("next-link");
    expect(link).toHaveAttribute("href", `event/${mockEvent.eventID}`);
  });

  it("renders all icons", () => {
    render(<SearchResult event={mockEvent} />);

    // Check if all info grid elements are rendered
    const infoElements = document.querySelectorAll(`.${styles.info}`);
    expect(infoElements.length).toBe(4); // Calendar, Clock, MapPin, Users
  });

  it("handles events with no tags", () => {
    const eventWithNoTags = {
      ...mockEvent,
      tags: [],
    };

    render(<SearchResult event={eventWithNoTags} />);

    // Tags container should exist but be empty
    const tagsContainer = document.querySelector(`.${styles.tagDiv}`);
    expect(tagsContainer).toBeInTheDocument();
    expect(tagsContainer?.children.length).toBe(0);
  });
});
