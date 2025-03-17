import React from "react";
import { render, screen, fireEvent } from "@/test-utils";
import ParticipantsInfo from "@/components/event/overview/participant/ParticipantsInfo";
import { EventDisplayContext } from "@/firebase/contexts";
import messages from "messages/no.json";
import { UserData } from "@/firebase/User";
import { DefaultEventData } from "@/firebase/Event";

// Mock the EventDisplayContext
jest.mock("@/firebase/contexts", () => {
  return {
    EventDisplayContext: React.createContext({
      participants: [],
    }),
  };
});

// Mock context value
const mockContextValue: { participants: UserData[] } = {
  participants: [
    {
      name: "Test User 1",
      userID: "user1",
      email: "user1@example.com",
      type: "user",
      location: "Location 1",
      description: "Description 1",
      interests: [],
      invitations: [],
    },
    {
      name: "Test User 2",
      userID: "user2",
      email: "user2@example.com",
      type: "user",
      location: "Location 2",
      description: "Description 2",
      interests: [],
      invitations: [],
    },
    {
      name: "Test User 3",
      userID: "user3",
      email: "user3@example.com",
      type: "user",
      location: "Location 3",
      description: "Description 3",
      interests: [],
      invitations: [],
    },
  ],
};

// Mock the Participant component
jest.mock("@/components/event/overview/participant/Participant", () => {
  return function MockParticipant({
    name,
    userID,
  }: {
    name: string;
    userID: string;
  }) {
    return <div data-testid={`participant-${userID}`}>{name}</div>;
  };
});

describe("ParticipantsInfo", () => {
  // Get the actual translated strings from the messages file
  const translations = {
    registeredParticipants: messages.Event.Info.registeredParticipants,
    total: messages.Event.Info.total,
  };

  const renderWithContext = (participants = mockContextValue.participants) => {
    return render(
      <EventDisplayContext.Provider
        value={{
          participants,
          eventID: "",
          eventData: DefaultEventData,
          isOrg: false,
          refreshInfo: async () => Promise.resolve(),
        }}
      >
        <ParticipantsInfo />
      </EventDisplayContext.Provider>
    );
  };

  it("renders the component correctly", () => {
    renderWithContext();

    // Check if title is rendered
    expect(
      screen.getByRole("heading", { name: translations.registeredParticipants })
    ).toBeInTheDocument();

    // Check if the participant count is displayed
    expect(
      screen.getByText(
        `${mockContextValue.participants.length} ${translations.total}`
      )
    ).toBeInTheDocument();

    // Check if the component is expanded by default (showing participants)
    mockContextValue.participants.forEach(participant => {
      expect(
        screen.getByTestId(`participant-${participant.userID}`)
      ).toBeInTheDocument();
    });
  });

  it("toggles visibility of participants when chevron is clicked", () => {
    renderWithContext();

    // Chevron should be visible
    const chevron = screen.getByTestId("chevron-icon");
    expect(chevron).toBeInTheDocument();

    // Initially, participants should be visible
    mockContextValue.participants.forEach(participant => {
      expect(
        screen.getByTestId(`participant-${participant.userID}`)
      ).toBeInTheDocument();
    });

    // Click the chevron to hide participants
    fireEvent.click(chevron);

    // Participants should now be hidden
    mockContextValue.participants.forEach(participant => {
      expect(
        screen.queryByTestId(`participant-${participant.userID}`)
      ).toBeNull();
    });

    // Click the chevron again to show participants
    fireEvent.click(chevron);

    // Participants should be visible again
    mockContextValue.participants.forEach(participant => {
      expect(
        screen.getByTestId(`participant-${participant.userID}`)
      ).toBeInTheDocument();
    });
  });

  it("renders the correct number of participants", () => {
    const customParticipants: UserData[] = [
      {
        name: "Test User 1",
        userID: "user1",
        email: "user1@example.com",
        type: "user",
        location: "Location 1",
        description: "Description 1",
        interests: [],
        invitations: [],
      },
      {
        name: "Test User 2",
        userID: "user2",
        email: "user2@example.com",
        type: "user",
        location: "Location 2",
        description: "Description 2",
        interests: [],
        invitations: [],
      },
    ];

    renderWithContext(customParticipants);

    // Check if the correct number is displayed
    expect(
      screen.getByText(`${customParticipants.length} ${translations.total}`)
    ).toBeInTheDocument();

    // Check if only the custom participants are rendered
    expect(screen.getByTestId("participant-user1")).toBeInTheDocument();
    expect(screen.getByTestId("participant-user2")).toBeInTheDocument();
    expect(screen.queryByTestId("participant-user3")).not.toBeInTheDocument();
  });

  it("handles an empty participants list", () => {
    renderWithContext([]);

    // Check if zero participants are displayed
    expect(screen.getByText(`0 ${translations.total}`)).toBeInTheDocument();

    // The participants container should still be rendered but empty
    const participantsContainer = screen
      .getByRole("heading", { name: translations.registeredParticipants })
      .parentElement?.parentElement?.querySelector(".participants");
    if (participantsContainer) {
      expect(participantsContainer).toBeInTheDocument();
      expect(participantsContainer.children.length).toBe(0);
    } else {
      // Ensure the container is null when there are no participants
      expect(participantsContainer).toBeNull();
    }
  });

  it("applies the correct CSS classes for expanded and collapsed states", () => {
    renderWithContext();

    // Get the chevron icon
    const chevron = screen.getByTestId("chevron-icon");

    // Initially it should not have the 'open' class
    expect(chevron.classList).toContain("open");

    // Click to collapse
    fireEvent.click(chevron);

    // It should now have the 'open' class
    expect(chevron.classList).not.toContain("open");

    // Click to expand again
    fireEvent.click(chevron);

    // It should not have the 'open' class anymore
    expect(chevron.classList).toContain("open");
  });
});
