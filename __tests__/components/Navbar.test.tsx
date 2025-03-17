import React from "react";
import { render, screen, fireEvent } from "@/test-utils";
import Navbar from "@/components/UI/Navbar";
import { useRouter } from "next/navigation";
import messages from "messages/no.json";
import styles from "./Navbar.module.css";

// Mock the components and hooks used in Navbar
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/UI/LanguageSwitch", () => {
  return function MockLanguageSwitch() {
    return <div data-testid="mock-language-switch" />;
  };
});

jest.mock("@/components/Button", () => {
  return function MockButton({
    text,
    icon,
    onClick,
    className,
  }: {
    text?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) {
    return (
      <button className={className} onClick={onClick} data-testid="mock-button">
        {icon && <span data-testid="button-icon">{icon}</span>}
        {text}
      </button>
    );
  };
});

describe("Navbar Component", () => {
  const mockPush = jest.fn();
  const mockUseRouter = useRouter as jest.Mock;

  // Get the actual translated strings from the messages file
  const translations = {
    appName: messages.Navbar.appName,
    explore: messages.Navbar.explore,
    yourEvents: messages.Navbar.yourEvents,
    calendar: messages.Navbar.calendar,
    create: messages.Navbar.create,
  };

  beforeEach(() => {
    // Setup mocks before each test
    mockUseRouter.mockReturnValue({
      push: mockPush,
    });
    mockPush.mockClear();
  });

  it("renders the Navbar correctly", () => {
    render(<Navbar />);

    // Check if the app name is rendered
    expect(screen.getByText(translations.appName)).toBeInTheDocument();

    // Check if navigation links are rendered
    expect(screen.getByText(translations.explore)).toBeInTheDocument();
    expect(screen.getByText(translations.yourEvents)).toBeInTheDocument();
    expect(screen.getByText(translations.calendar)).toBeInTheDocument();

    // Check if the create button is rendered
    expect(screen.getByText(translations.create)).toBeInTheDocument();

    // Check if the profile link is rendered
    const profileLink = screen.getByRole("link", { name: "" }); // User icon link
    expect(profileLink).toHaveAttribute("href", "/profile");

    // Check if the language switch is rendered
    expect(screen.getByTestId("mock-language-switch")).toBeInTheDocument();
  });

  it("navigates to home page when clicking on the logo", () => {
    render(<Navbar />);

    const logoLink = screen.getByText(translations.appName).closest("a");
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("navigates to event creation page when clicking the create button", () => {
    render(<Navbar />);

    const createButton = screen.getByTestId("mock-button");
    fireEvent.click(createButton);

    expect(mockPush).toHaveBeenCalledWith("/event/create");
  });

  it("applies the correct CSS classes", () => {
    render(<Navbar />);

    // Check if nav contains the expected class
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass(styles.navigationBar);

    // Check logo styling
    const logoContainer = screen.getByText(translations.appName).closest("a");
    expect(logoContainer).toHaveClass(styles.flex_center);
    expect(screen.getByText(translations.appName)).toHaveClass(styles.logoText);

    // Check links container
    const linksContainer = screen
      .getByText(translations.explore)
      .closest("div");
    expect(linksContainer).toHaveClass(styles.links);
    expect(linksContainer).toHaveClass(styles.flex_center);

    // Check link styling
    const links = screen.getAllByRole("link");
    links.forEach(link => {
      if (
        link.textContent === translations.explore ||
        link.textContent === translations.yourEvents ||
        link.textContent === translations.calendar
      ) {
        expect(link).toHaveClass(styles.link);
      }
    });

    // Check create button styling
    const createButton = screen.getByTestId("mock-button");
    expect(createButton).toHaveClass(styles.addEventButton);

    // Check profile link styling
    const profileLink = screen.getByRole("link", { name: "" }); // User icon link
    expect(profileLink).toHaveClass(styles.profile);
  });

  it("renders the Calendar and User icons", () => {
    render(<Navbar />);

    // Check for Calendar icon (in logo)
    const calendarIcon = document.querySelector("svg"); // First SVG should be the Calendar
    expect(calendarIcon).toBeInTheDocument();

    // Check for Plus icon in button
    const plusIcon = screen.getByTestId("button-icon");
    expect(plusIcon).toBeInTheDocument();

    // Check for User icon in profile link
    const userIcon = screen
      .getByRole("link", { name: "" })
      .querySelector("svg");
    expect(userIcon).toBeInTheDocument();
  });
});
