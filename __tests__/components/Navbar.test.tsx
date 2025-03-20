import React from "react";
import { render, screen, fireEvent } from "@/test-utils";
import Navbar from "@/components/UI/Navbar";
import { useRouter } from "next/navigation";
import messages from "messages/no.json";
import styles from "./Navbar.module.css";

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

  const translations = {
    appName: messages.Navbar.appName,
    explore: messages.Navbar.explore,
    yourEvents: messages.Navbar.yourEvents,
    calendar: messages.Navbar.calendar,
    create: messages.Navbar.create,
  };

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
    });
    mockPush.mockClear();
  });

  it("renders the Navbar correctly", () => {
    render(<Navbar />);

    expect(screen.getByText(translations.appName)).toBeInTheDocument();
    expect(screen.getByText(translations.explore)).toBeInTheDocument();
    expect(screen.getByText(translations.yourEvents)).toBeInTheDocument();
    expect(screen.getByText(translations.calendar)).toBeInTheDocument();
    expect(screen.getByText(translations.create)).toBeInTheDocument();

    const profileLink = screen.getByRole("link", { name: "" });
    expect(profileLink).toHaveAttribute("href", "/profile");
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

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass(styles.navigationBar);

    const logoContainer = screen.getByText(translations.appName).closest("a");
    expect(logoContainer).toHaveClass(styles.flex_center);
    expect(screen.getByText(translations.appName)).toHaveClass(styles.logoText);

    const linksContainer = screen
      .getByText(translations.explore)
      .closest("div");
    expect(linksContainer).toHaveClass(styles.links);
    expect(linksContainer).toHaveClass(styles.flex_center);

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

    const createButton = screen.getByTestId("mock-button");
    expect(createButton).toHaveClass(styles.addEventButton);

    const profileLink = screen.getByRole("link", { name: "" });
    expect(profileLink).toHaveClass(styles.profile);
  });

  it("renders the Calendar and User icons", () => {
    render(<Navbar />);

    const calendarIcon = document.querySelector("svg");
    expect(calendarIcon).toBeInTheDocument();

    const plusIcon = screen.getByTestId("button-icon");
    expect(plusIcon).toBeInTheDocument();

    const userIcon = screen
      .getByRole("link", { name: "" })
      .querySelector("svg");
    expect(userIcon).toBeInTheDocument();
  });
});
