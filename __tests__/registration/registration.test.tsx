import { render, screen } from "@testing-library/react";
import Registration from "@/components/event/overview/Registration";
import { useAuth } from "@/firebase/AuthService";
import { getEvent } from "@/firebase/DatabaseService";

// Mock `useAuth` for å kontrollere autentiseringstilstand
jest.mock("@/firebase/AuthService", () => ({
  useAuth: jest.fn(),
}));

// Mock `getEvent` for å unngå databasekall
jest.mock("@/firebase/DatabaseService", () => ({
  getEvent: jest.fn(),
  joinEvent: jest.fn(),
  leaveEvent: jest.fn(),
  deleteEvent: jest.fn(),
}));

describe("Registration Component", () => {
  beforeEach(() => {
    // Mock returnverdi for `useAuth`
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "123" },
      isLoggedIn: true,
      isAdministrator: false,
    });
  });

  /*test("rendrer uten feil", async () => {
    render(<Registration eventID="test-event" />);
    expect(screen.getByText("Påmelding")).toBeInTheDocument();
  });**/
});
