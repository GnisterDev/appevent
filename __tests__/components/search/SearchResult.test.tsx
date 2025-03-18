import React from "react";
import { render, screen } from "@/test-utils";
import SearchResult from "@/components/eventSearch/SearchResult";
import { EventData } from "@/firebase/Event";
import { DocumentReference, Timestamp } from "firebase/firestore";
import styles from "@/components/eventSearch/SearchResult.module.css";

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

jest.mock("@/components/event/Tag", () => {
  return function MockTag({ text }: { text: string }) {
    return <div data-testid={`tag-${text}`}>{text}</div>;
  };
});

jest.mock("@/components/Button", () => {
  return function MockButton({ text }: { text: string }) {
    return <button data-testid="see-more-button">{text}</button>;
  };
});

describe("SearchResult", () => {
  const EVENT_DESCRIPTION_CUTOFF = 50;

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

  const mockEventLongDesc: EventData = {
    ...mockEvent,
    description:
      "This is a very long description that should be truncated because it exceeds the character limit defined for the event description in the search results component and we want to make sure it works properly for user experience.",
  };

  it("renders event information correctly", () => {
    render(<SearchResult event={mockEvent} />);

    expect(screen.getByText(mockEvent.title)).toBeInTheDocument();
    expect(screen.getByText(mockEvent.location)).toBeInTheDocument();
    expect(
      screen.getByText(mockEvent.participants.length.toString())
    ).toBeInTheDocument();
    expect(screen.getByText(mockEvent.description)).toBeInTheDocument();
    mockEvent.tags.forEach(tag => {
      expect(screen.getByTestId(`tag-${tag}`)).toBeInTheDocument();
    });
    expect(screen.getByTestId("see-more-button")).toBeInTheDocument();
    expect(screen.getByText("Se mer")).toBeInTheDocument();
  });

  it("formats the date correctly", () => {
    render(<SearchResult event={mockEvent} />);

    const expectedDateFormat = new Date(mockEvent.startTime.toDate())
      .toLocaleString("no-nb", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replaceAll(".", "/")
      .replaceAll(",", "");

    const dateElements = screen.getAllByText(expectedDateFormat);
    expect(dateElements.length).toBe(2);
  });

  it("truncates long descriptions", () => {
    render(<SearchResult event={mockEventLongDesc} />);

    const truncatedDesc = `${mockEventLongDesc.description.substring(
      0,
      EVENT_DESCRIPTION_CUTOFF
    )}...`;

    expect(screen.getByText(truncatedDesc)).toBeInTheDocument();
    expect(
      screen.queryByText(mockEventLongDesc.description)
    ).not.toBeInTheDocument();
  });

  it("does not truncate short descriptions", () => {
    render(<SearchResult event={mockEvent} />);

    expect(screen.getByText(mockEvent.description)).toBeInTheDocument();
    const truncatedDesc = `${mockEvent.description.substring(
      0,
      EVENT_DESCRIPTION_CUTOFF
    )}...`;
    expect(screen.queryByText(truncatedDesc)).not.toBeInTheDocument();
  });

  it("creates correct link to event page", () => {
    render(<SearchResult event={mockEvent} />);

    const link = screen.getByTestId("next-link");
    expect(link).toHaveAttribute("href", `event/${mockEvent.eventID}`);
  });

  it("renders all icons", () => {
    render(<SearchResult event={mockEvent} />);

    const infoElements = document.querySelectorAll(`.${styles.info}`);
    expect(infoElements.length).toBe(4); // Calendar, Clock, MapPin, Users
  });

  it("handles events with no tags", () => {
    const eventWithNoTags = {
      ...mockEvent,
      tags: [],
    };

    render(<SearchResult event={eventWithNoTags} />);

    const tagsContainer = document.querySelector(`.${styles.tagDiv}`);
    expect(tagsContainer).toBeInTheDocument();
    expect(tagsContainer?.children.length).toBe(0);
  });
});
