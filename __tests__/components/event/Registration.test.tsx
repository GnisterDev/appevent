import React from "react";
import { render, screen, fireEvent, waitFor } from "@/test-utils";
import Registration from "@/components/event/overview/Registration";
import { EventDisplayContext } from "@/firebase/contexts";
import messages from "messages/no.json";
import { UserData } from "@/firebase/User";
import { useRouter } from "next/navigation";
import * as AuthService from "@/firebase/AuthService";
import * as DatabaseService from "@/firebase/DatabaseService";
import { EventData } from "@/firebase/Event";
import { DocumentReference, Timestamp } from "firebase/firestore";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/firebase/AuthService", () => ({
  getUserID: jest.fn(),
  isAdministrator: jest.fn(),
}));

jest.mock("@/firebase/DatabaseService", () => ({
  joinEvent: jest.fn(),
  leaveEvent: jest.fn(),
  deleteEvent: jest.fn(),
  isParticipant: jest.fn(),
  getUser: jest.fn(),
}));

jest.mock("@/firebase/contexts", () => {
  return {
    EventDisplayContext: React.createContext({
      eventData: null,
      eventID: null,
      isOrg: false,
      refreshInfo: jest.fn(),
    }),
  };
});

describe("Registration", () => {
  const translations = {
    organizorTitle: messages.Event.Info.organizorTitle,
    participantTitle: messages.Event.Info.participantTitle,
    subtext: messages.Event.Info.subtext,
    organizor: messages.Event.Info.organizor,
    organizorIsYou: messages.Event.Info.organizorIsYou,
    status: messages.Event.Info.status,
    private: messages.Event.Info.private,
    public: messages.Event.Info.public,
    edit: messages.Event.Info.edit,
    subscribe: messages.Event.Info.subscribe,
    unsubscribe: messages.Event.Info.unsubscribe,
    share: messages.Event.Info.share,
    delete: messages.Event.Info.delete,
  };

  const mockUserID = "user123";
  const mockOrganizerID = "org123";
  const mockEventID = "event123";
  const mockUser: UserData = {
    name: "Test Organizer",
    userID: mockOrganizerID,
    email: "organizer@example.com",
    type: "user",
    location: "Oslo",
    description: "Test organizer description",
    interests: [],
    invitations: [],
  };

  const mockEventData: EventData = {
    title: "Test Event",
    description: "This is a test event",
    location: "Oslo, Norway",
    private: false,
    organizer: { id: mockOrganizerID } as unknown as DocumentReference,
    startTime: {
      toDate: () => new Date(),
    } as unknown as Timestamp,
    participants: [],
    type: "Example Type",
    tags: ["tech", "networking"],
    comments: [],
    eventID: "",
  };

  // Mock router
  const mockPush = jest.fn();
  const mockRefreshInfo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (AuthService.getUserID as jest.Mock).mockReturnValue(mockUserID);
    (AuthService.isAdministrator as jest.Mock).mockReturnValue(false);
    (DatabaseService.isParticipant as jest.Mock).mockResolvedValue(false);
    (DatabaseService.getUser as jest.Mock).mockResolvedValue(mockUser);
    (DatabaseService.joinEvent as jest.Mock).mockResolvedValue(undefined);
    (DatabaseService.leaveEvent as jest.Mock).mockResolvedValue(undefined);
    (DatabaseService.deleteEvent as jest.Mock).mockResolvedValue(undefined);

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  const renderWithContext = (
    eventID = mockEventID,
    eventData = mockEventData,
    isOrg = false
  ) => {
    return render(
      <EventDisplayContext.Provider
        value={{
          eventID,
          eventData,
          isOrg,
          participants: [],
          refreshInfo: mockRefreshInfo,
        }}
      >
        <Registration />
      </EventDisplayContext.Provider>
    );
  };

  it("renders nothing when eventID is null", () => {
    const { container } = renderWithContext(null as unknown as undefined);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when eventData is null", () => {
    const { container } = renderWithContext(
      mockEventID,
      null as unknown as undefined
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders participant view correctly when not organizer and not participating", async () => {
    renderWithContext(mockEventID, mockEventData, false);

    await waitFor(() => {
      expect(DatabaseService.isParticipant).toHaveBeenCalledWith(mockEventID);
    });
    expect(
      await screen.findByText(translations.participantTitle)
    ).toBeInTheDocument();

    expect(screen.getByText(translations.subtext)).toBeInTheDocument();
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(translations.public)).toBeInTheDocument();
    expect(
      screen.getByTestId(`button-${translations.subscribe}`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`button-${translations.share}`)
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(`button-${translations.edit}`)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`button-${translations.delete}`)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`button-${translations.unsubscribe}`)
    ).not.toBeInTheDocument();
  });

  it("renders organizer view correctly", async () => {
    renderWithContext(mockEventID, mockEventData, true);

    await waitFor(() => {
      expect(DatabaseService.isParticipant).toHaveBeenCalledWith(mockEventID);
    });
    expect(
      await screen.findByText(translations.organizorTitle)
    ).toBeInTheDocument();

    expect(
      screen.getByTestId(`button-${translations.edit}`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`button-${translations.share}`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`button-${translations.delete}`)
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(`button-${translations.subscribe}`)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`button-${translations.unsubscribe}`)
    ).not.toBeInTheDocument();
  });

  it("shows 'You' as organizer when current user is the organizer", async () => {
    (AuthService.getUserID as jest.Mock).mockReturnValue(mockOrganizerID);

    renderWithContext(mockEventID, mockEventData, true);

    await waitFor(() => {
      expect(DatabaseService.isParticipant).toHaveBeenCalledWith(mockEventID);
    });
    expect(
      await screen.findByText(translations.organizorIsYou)
    ).toBeInTheDocument();
  });

  it("shows unsubscribe button when user is already participating", async () => {
    (DatabaseService.isParticipant as jest.Mock).mockResolvedValue(true);

    renderWithContext(mockEventID, mockEventData, false);

    await waitFor(() => {
      expect(
        screen.getByTestId(`button-${translations.unsubscribe}`)
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId(`button-${translations.subscribe}`)
      ).not.toBeInTheDocument();
    });
  });

  it("calls joinEvent and refreshInfo when subscribe button is clicked", async () => {
    renderWithContext(mockEventID, mockEventData, false);

    await waitFor(() => {
      expect(DatabaseService.isParticipant).toHaveBeenCalledWith(mockEventID);
    });

    const subscribeButton = await screen.findByTestId(
      `button-${translations.subscribe}`
    );
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(DatabaseService.joinEvent).toHaveBeenCalledWith(mockEventID);
      expect(mockRefreshInfo).toHaveBeenCalled();
    });
  });

  it("calls leaveEvent and refreshInfo when unsubscribe button is clicked", async () => {
    (DatabaseService.isParticipant as jest.Mock).mockResolvedValue(true);

    renderWithContext(mockEventID, mockEventData, false);

    await waitFor(() => {
      expect(DatabaseService.isParticipant).toHaveBeenCalledWith(mockEventID);
    });

    const unsubscribeButton = await screen.findByTestId(
      `button-${translations.unsubscribe}`
    );
    fireEvent.click(unsubscribeButton);

    await waitFor(() => {
      expect(DatabaseService.leaveEvent).toHaveBeenCalledWith(mockEventID);
      expect(mockRefreshInfo).toHaveBeenCalled();
    });
  });

  it("redirects to edit page when edit button is clicked", async () => {
    renderWithContext(mockEventID, mockEventData, true);

    await waitFor(() => {
      expect(DatabaseService.isParticipant).toHaveBeenCalledWith(mockEventID);
    });

    const editButton = await screen.findByTestId(`button-${translations.edit}`);
    fireEvent.click(editButton);

    expect(mockPush).toHaveBeenCalledWith(`/event/${mockEventID}/edit`);
  });

  it("calls deleteEvent and redirects to home when delete button is clicked", async () => {
    renderWithContext(mockEventID, mockEventData, true);

    await waitFor(() => {
      expect(DatabaseService.isParticipant).toHaveBeenCalledWith(mockEventID);
    });

    const deleteButton = await screen.findByTestId(
      `button-${translations.delete}`
    );
    fireEvent.click(deleteButton);

    expect(DatabaseService.deleteEvent).toHaveBeenCalledWith(mockEventID);
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("shows delete button for admin users even if not organizer", async () => {
    (AuthService.isAdministrator as jest.Mock).mockReturnValue(true);

    renderWithContext(mockEventID, mockEventData, false);

    await waitFor(() => {
      expect(DatabaseService.isParticipant).toHaveBeenCalledWith(mockEventID);
    });

    expect(
      await screen.findByTestId(`button-${translations.delete}`)
    ).toBeInTheDocument();
  });

  it("redirects to home page after leaving a private event", async () => {
    const privateEvent = {
      ...mockEventData,
      private: true,
    };

    (DatabaseService.isParticipant as jest.Mock).mockResolvedValue(true);

    await waitFor(() => {
      renderWithContext(mockEventID, privateEvent, false);
    });

    await waitFor(() => {
      expect(DatabaseService.isParticipant).toHaveBeenCalledWith(mockEventID);
    });

    const unsubscribeButton = screen.getByTestId(
      `button-${translations.unsubscribe}`
    );
    fireEvent.click(unsubscribeButton);

    await waitFor(() => {
      expect(DatabaseService.leaveEvent).toHaveBeenCalledWith(mockEventID);
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("handles alert dialog when share button is clicked", async () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    renderWithContext(mockEventID, mockEventData, false);

    await waitFor(() => {
      expect(DatabaseService.isParticipant).toHaveBeenCalledWith(mockEventID);
    });

    const shareButton = screen.getByTestId(`button-${translations.share}`);
    fireEvent.click(shareButton);

    expect(alertMock).toHaveBeenCalled();

    alertMock.mockRestore();
  });
});
