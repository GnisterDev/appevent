import React from "react";
import { render, screen, fireEvent } from "@/test-utils";
import ParticipantsInfo from "@/components/event/overview/participant/ParticipantsInfo";
import { EventDisplayContext } from "@/firebase/contexts";
import messages from "messages/no.json";
import { UserData } from "@/firebase/User";
import { DefaultEventData } from "@/firebase/Event";

jest.mock("@/firebase/contexts", () => {
  return {
    EventDisplayContext: React.createContext({
      participants: [],
    }),
  };
});

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

    expect(
      screen.getByRole("heading", { name: translations.registeredParticipants })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${mockContextValue.participants.length} ${translations.total}`
      )
    ).toBeInTheDocument();
    mockContextValue.participants.forEach(participant => {
      expect(
        screen.getByTestId(`participant-${participant.userID}`)
      ).toBeInTheDocument();
    });
  });

  it("toggles visibility of participants when chevron is clicked", () => {
    renderWithContext();

    const chevron = screen.getByTestId("chevron-icon");
    expect(chevron).toBeInTheDocument();

    mockContextValue.participants.forEach(participant => {
      expect(
        screen.getByTestId(`participant-${participant.userID}`)
      ).toBeInTheDocument();
    });

    fireEvent.click(chevron);
    mockContextValue.participants.forEach(participant => {
      expect(
        screen.queryByTestId(`participant-${participant.userID}`)
      ).toBeNull();
    });

    fireEvent.click(chevron);
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

    expect(
      screen.getByText(`${customParticipants.length} ${translations.total}`)
    ).toBeInTheDocument();
    expect(screen.getByTestId("participant-user1")).toBeInTheDocument();
    expect(screen.getByTestId("participant-user2")).toBeInTheDocument();
    expect(screen.queryByTestId("participant-user3")).not.toBeInTheDocument();
  });

  it("handles an empty participants list", () => {
    renderWithContext([]);

    expect(screen.getByText(`0 ${translations.total}`)).toBeInTheDocument();

    const participantsContainer = screen
      .getByRole("heading", { name: translations.registeredParticipants })
      .parentElement?.parentElement?.querySelector(".participants");

    if (participantsContainer) {
      expect(participantsContainer).toBeInTheDocument();
      expect(participantsContainer.children.length).toBe(0);
    } else {
      expect(participantsContainer).toBeNull();
    }
  });

  it("applies the correct CSS classes for expanded and collapsed states", () => {
    renderWithContext();

    const chevron = screen.getByTestId("chevron-icon");
    expect(chevron.classList).toContain("open");

    fireEvent.click(chevron);

    expect(chevron.classList).not.toContain("open");

    fireEvent.click(chevron);

    expect(chevron.classList).toContain("open");
  });
});
