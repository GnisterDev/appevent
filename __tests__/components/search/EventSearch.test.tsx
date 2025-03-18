import React from "react";
import { render, screen, fireEvent, waitFor } from "@/test-utils";
import EventSearch from "@/components/eventSearch/EventSearch";
import { eventSearch } from "@/firebase/DatabaseService";
import { EVENT_GROUPS, EventData } from "@/firebase/Event";
import messages from "messages/no.json";

// Mock the DatabaseService
jest.mock("@/firebase/DatabaseService", () => ({
  eventSearch: jest.fn(),
}));

// Mock the SearchResult component
jest.mock("@/components/eventSearch/SearchResult", () => {
  return function MockSearchResult({ event }: { event: EventData }) {
    return (
      <div data-testid={`search-result-${event.eventID}`}>{event.title}</div>
    );
  };
});

describe("EventSearch", () => {
  // Get translations
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

    // Check if all search inputs are rendered
    expect(screen.getByTestId("input-name")).toBeInTheDocument();
    expect(screen.getByTestId("input-location")).toBeInTheDocument();
    expect(screen.getByTestId("input-date")).toBeInTheDocument();

    // Check if the type select is rendered
    expect(screen.getByRole("combobox")).toBeInTheDocument();

    // Check if both buttons are rendered
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

    // Click to open the dropdown
    fireEvent.click(typeSelect);

    // Check if the default option is there
    expect(screen.getByText(translations.selectType)).toBeInTheDocument();

    // Check if all event types from EVENT_GROUPS are rendered
    Object.entries(EVENT_GROUPS).forEach(([, events]) => {
      events.forEach(eventType => {
        // Note: This may need adjustment depending on how option groups are rendered in your environment
        expect(screen.getByText(eventType)).toBeInTheDocument();
      });
    });
  });

  it("handles empty search results", async () => {
    (eventSearch as jest.Mock).mockResolvedValue([]);

    render(<EventSearch />);

    // Click search button
    const searchButton = screen.getByTestId(`button-${translations.search}`);
    fireEvent.click(searchButton);

    // Wait for search to complete
    await waitFor(() => {
      expect(eventSearch).toHaveBeenCalled();
    });

    // Output list should be empty
    const outputList = document.querySelector(".outputList");
    expect(outputList).toBeInTheDocument();
    expect(outputList?.children.length).toBe(0);
  });
});
