import React from "react";
import { render, screen, fireEvent, waitFor } from "@/test-utils";
import EventSearch from "@/components/eventSearch/EventSearch";
import { eventSearch } from "@/firebase/DatabaseService";
import { EVENT_GROUPS, EventData } from "@/firebase/Event";
import messages from "messages/no.json";

jest.mock("@/firebase/DatabaseService", () => ({
  eventSearch: jest.fn(),
}));

jest.mock("@/components/eventSearch/SearchResult", () => {
  return function MockSearchResult({ event }: { event: EventData }) {
    return (
      <div data-testid={`search-result-${event.eventID}`}>{event.title}</div>
    );
  };
});

describe("EventSearch", () => {
  const translations = {
    searchAfter: messages.Search.searchAfter,
    place: messages.Search.place,
    chooseDate: messages.Search.chooseDate,
    selectType: messages.Search.selectType,
    search: messages.Search.search,
    empty: messages.Search.empty,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (eventSearch as jest.Mock).mockResolvedValue([]);
  });

  it("renders the search form with all inputs", () => {
    render(<EventSearch />);

    expect(screen.getByTestId("input-name")).toBeInTheDocument();
    expect(screen.getByTestId("input-location")).toBeInTheDocument();
    expect(screen.getByTestId("input-date")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByTestId(`button-${translations.search}`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`button-${translations.empty}`)
    ).toBeInTheDocument();
  });

  it("renders event type options correctly", () => {
    render(<EventSearch />);

    const typeSelect = screen.getByRole("combobox");

    fireEvent.click(typeSelect);

    expect(screen.getByText(translations.selectType)).toBeInTheDocument();
    Object.entries(EVENT_GROUPS).forEach(([, events]) => {
      events.forEach(eventType => {
        expect(screen.getByText(eventType)).toBeInTheDocument();
      });
    });
  });

  it("handles empty search results", async () => {
    (eventSearch as jest.Mock).mockResolvedValue([]);

    render(<EventSearch />);

    const searchButton = screen.getByTestId(`button-${translations.search}`);

    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(eventSearch).toHaveBeenCalled();
    });

    const outputList = document.querySelector(".outputList");
    expect(outputList).toBeInTheDocument();
    expect(outputList?.children.length).toBe(0);
  });
});
