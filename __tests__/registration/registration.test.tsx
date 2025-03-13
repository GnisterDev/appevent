import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Registration from "@/components/event/overview/Registration";
import { useAuth } from "@/firebase/AuthService";
import { joinEvent, leaveEvent, getEvent, deleteEvent } from "@/firebase/DatabaseService";
import { useRouter } from "next/navigation";

jest.mock("@/firebase/AuthService", () => ({
  useAuth: jest.fn(),
  isAdministrator: jest.fn(() => false),
  isOrganizer: jest.fn(() => false),
}));

jest.mock("@/firebase/DatabaseService", () => ({
  joinEvent: jest.fn(),
  leaveEvent: jest.fn(),
  getEvent: jest.fn(),
  deleteEvent: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Registration Component", () => {
  const eventID = "test-event";
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuth as jest.Mock).mockReturnValue({ user: { uid: "123" }, isLoggedIn: true });
    (getEvent as jest.Mock).mockResolvedValue({ participants: [{ id: "123" }] });
  });

  test("rendrer komponenten med riktig tittel", async () => {
    render(<Registration eventID={eventID} />);
    expect(screen.getByText("Påmelding")).toBeInTheDocument();
  });

  test("viser påmeldingsknapp når brukeren ikke er påmeldt", async () => {
    (getEvent as jest.Mock).mockResolvedValue({ participants: [] });
    render(<Registration eventID={eventID} />);
    await waitFor(() => {
      expect(screen.getByText("Meld meg på")).toBeInTheDocument();
    });
  });

  test("viser avmeldingsknapp når brukeren er påmeldt", async () => {
    render(<Registration eventID={eventID} />);
    await waitFor(() => {
      expect(screen.getByText("Meld meg av")).toBeInTheDocument();
    });
  });

  test("bruker kan melde seg på et arrangement", async () => {
    (getEvent as jest.Mock).mockResolvedValue({ participants: [] });
    render(<Registration eventID={eventID} />);
    fireEvent.click(screen.getByText("Meld meg på"));
    await waitFor(() => {
      expect(joinEvent).toHaveBeenCalledWith(eventID);
    });
  });

  test("bruker kan melde seg av et arrangement", async () => {
    render(<Registration eventID={eventID} />);
    fireEvent.click(screen.getByText("Meld meg av"));
    await waitFor(() => {
      expect(leaveEvent).toHaveBeenCalledWith(eventID);
    });
  });

  test("sletter arrangement hvis administrator", async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { uid: "123" }, isLoggedIn: true });
    (useAuth.isAdministrator as jest.Mock).mockReturnValue(true);
    render(<Registration eventID={eventID} />);
    fireEvent.click(screen.getByText("Slett arrangement"));
    await waitFor(() => {
      expect(deleteEvent).toHaveBeenCalledWith(eventID);
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});
