import React from "react";
import { render, screen } from "@/test-utils";
import SignUp from "@/app/signup/page";
import styles from "./signUp.module.css";
import messages from "messages/no.json";
import SignUpForm from "@/components/auth/SignUpForm";

// Mock the components used in SignUp
jest.mock("@/components/auth/SignUpForm", () => {
  return jest.fn(() => <div data-testid="mock-signup-form" />);
});

jest.mock("@/components/Card", () => {
  return function MockCard({
    children,
    title,
    color,
    className,
  }: {
    children: React.ReactNode;
    title: string;
    color: string;
    className: string;
  }) {
    return (
      <div data-testid="mock-card" className={className} style={{ color }}>
        <h3>{title}</h3>
        <div>{children}</div>
      </div>
    );
  };
});

describe("SignUp Page", () => {
  // Get the actual translated strings from the messages file
  const translations = {
    title: messages.Auth.SignUp.title,
    subtitle: messages.Auth.SignUp.subtitle,
    card1Title: messages.Auth.SignUp.cards[0].title,
    card1Content: messages.Auth.SignUp.cards[0].content,
    card2Title: messages.Auth.SignUp.cards[1].title,
    card2Content: messages.Auth.SignUp.cards[1].content,
  };

  beforeEach(() => {
    (SignUpForm as jest.Mock).mockClear();
  });

  it("renders the SignUp page correctly", () => {
    render(<SignUp />);

    // Check if the page title and subtitle are rendered
    expect(screen.getByText(translations.title)).toBeInTheDocument();
    expect(screen.getByText(translations.subtitle)).toBeInTheDocument();

    // Check if both Card components are rendered with correct props
    const cards = screen.getAllByTestId("mock-card");
    expect(cards).toHaveLength(2);

    // Check first card content
    expect(screen.getByText(translations.card1Title)).toBeInTheDocument();
    expect(screen.getByText(translations.card1Content)).toBeInTheDocument();

    // Check second card content
    expect(screen.getByText(translations.card2Title)).toBeInTheDocument();
    expect(screen.getByText(translations.card2Content)).toBeInTheDocument();

    // Check if the SignUpForm is rendered
    expect(screen.getByTestId("mock-signup-form")).toBeInTheDocument();
    expect(SignUpForm).toHaveBeenCalled();
  });

  it("applies the correct CSS classes", () => {
    render(<SignUp />);

    // Check if main contains the expected class
    const main = screen.getByRole("main");
    expect(main).toHaveClass(styles.main);

    // Find container div and check it has the right class
    const container = main.querySelector(`.${styles.container}`);
    expect(container).toBeInTheDocument();

    // Check info section
    const info = container?.querySelector(`.${styles.info}`);
    expect(info).toBeInTheDocument();

    // Check header section
    const header = info?.querySelector(`.${styles.header}`);
    expect(header).toBeInTheDocument();

    // Check card styling
    const cards = screen.getAllByTestId("mock-card");
    cards.forEach(card => {
      expect(card).toHaveClass(styles.card);
    });

    // Check form section
    const form = container?.querySelector(`.${styles.form}`);
    expect(form).toBeInTheDocument();
  });

  it("passes the correct props to Card components", () => {
    render(<SignUp />);

    const cards = screen.getAllByTestId("mock-card");

    // First card should have secondary color
    expect(cards[0]).toHaveStyle({ color: "var(--secondary)" });
    expect(screen.getByText(translations.card1Title)).toBeInTheDocument();

    // Second card should have the color-mix style
    expect(cards[1]).toHaveStyle({
      color: "color-mix(in srgb, var(--error) 25%, white)",
    });
    expect(screen.getByText(translations.card2Title)).toBeInTheDocument();
  });
});
