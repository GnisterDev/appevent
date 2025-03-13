import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EventSearch from "@/components/eventSearch/EventSearch";
import { eventSearch } from "@/firebase/DatabaseService";
import { useRouter } from "next/navigation";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock eventSearch for å unngå ekte API-kall
jest.mock("@/firebase/DatabaseService", () => ({
  eventSearch: jest.fn(),
}));

describe("EventSearch Component", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });

    (eventSearch as jest.Mock).mockResolvedValue([
      {
        id: "1",
        title: "Testarrangement",
        startTime: { toDate: () => new Date("2025-04-20") },
        location: "Oslo",
        tags: ["Teknologi", "NTNU"],
      },
    ]);
  });

  test("rendrer komponenten uten feil", () => {
    render(<EventSearch />);
    expect(screen.getByText("Søk etter et arrangement")).toBeInTheDocument();
  });

  test("bruker kan fylle ut søkefelt og trigge søk", async () => {
    render(<EventSearch />);

    // Skriv inn et arrangementnavn
    fireEvent.change(screen.getByPlaceholderText("Navn"), {
      target: { value: "Testarrangement" },
    });

    // Klikk på søkeknappen
    fireEvent.click(screen.getByText("Søk"));

    // Vent på at resultater vises
    await waitFor(() => {
      expect(
        screen.getByText("Testarrangement (20.4.2025)")
      ).toBeInTheDocument();
      expect(screen.getByText("Oslo")).toBeInTheDocument();
    });
  });

  test("nullstiller søkefilteret", async () => {
    render(<EventSearch />);

    // Skriv inn noe i feltet
    fireEvent.change(screen.getByPlaceholderText("Navn"), {
      target: { value: "Testarrangement" },
    });

    // Klikk på nullstill-knappen
    fireEvent.click(screen.getByText("Fjern filter"));

    // Sjekk at input-feltet er tomt igjen
    expect(screen.getByPlaceholderText("Navn")).toHaveValue("");
  });

  test("navigerer til arrangementsside ved klikk på resultat", async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    render(<EventSearch />);

    // Klikk på søk for å få resultater
    fireEvent.click(screen.getByText("Søk"));

    await waitFor(() => {
      expect(
        screen.getByText("Testarrangement (20.4.2025)")
      ).toBeInTheDocument();
    });

    // Klikk på arrangementet
    fireEvent.click(screen.getByText("Testarrangement (20.4.2025)"));

    // Sjekk at router.push ble kalt med riktig ID
    expect(mockPush).toHaveBeenCalledWith("/event/1");
  });
});
