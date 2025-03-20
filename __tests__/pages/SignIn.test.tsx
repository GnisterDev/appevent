import React from "react";
import { render, screen } from "@/test-utils";
import SignIn from "@/app/signin/page";
import messages from "messages/no.json";
import SignInForm from "@/components/auth/SignInForm";
import styles from "@/app/signin/signIn.module.css";

// Mock the components used in SignIn
jest.mock("@/components/auth/SignInForm", () => {
  return jest.fn(() => <div data-testid="mock-signin-form" />);
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

describe("SignIn Page", () => {
  const translations = {
    title: messages.Auth.SignIn.title,
    subtitle: messages.Auth.SignIn.subtitle,
    cardTitle: messages.Auth.SignIn.cards[0].title,
    cardContent: messages.Auth.SignIn.cards[0].content,
  };

  beforeEach(() => {
    (SignInForm as jest.Mock).mockClear();
  });

  it("renders the SignIn page correctly", () => {
    render(<SignIn />);

    expect(screen.getByText(translations.title)).toBeInTheDocument();
    expect(screen.getByText(translations.subtitle)).toBeInTheDocument();

    const card = screen.getByTestId("mock-card");
    expect(card).toBeInTheDocument();
    expect(screen.getByText(translations.cardTitle)).toBeInTheDocument();
    expect(screen.getByText(translations.cardContent)).toBeInTheDocument();

    expect(screen.getByTestId("mock-signin-form")).toBeInTheDocument();
    expect(SignInForm).toHaveBeenCalled();
  });

  it("applies the correct CSS classes", () => {
    render(<SignIn />);

    const main = screen.getByRole("main");
    const container = main.querySelector(`.${styles.container}`);
    const info = container?.querySelector(`.${styles.info}`);
    const header = info?.querySelector(`.${styles.header}`);
    const card = screen.getByTestId("mock-card");
    const form = container?.querySelector(`.${styles.form}`);

    expect(main).toHaveClass(styles.main);
    expect(container).toBeInTheDocument();
    expect(info).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(card).toHaveClass(styles.card);
    expect(form).toBeInTheDocument();
  });

  it("passes the correct props to Card component", () => {
    render(<SignIn />);

    const card = screen.getByTestId("mock-card");
    expect(card).toHaveClass(styles.card);
    expect(card).toHaveStyle({ color: "var(--secondary)" });
    expect(screen.getByText(translations.cardTitle)).toBeInTheDocument();
  });
});
