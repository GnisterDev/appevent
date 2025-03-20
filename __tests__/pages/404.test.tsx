import React from "react";
import { render, screen } from "@testing-library/react";
import NotFound from "@/app/404/page";

jest.mock("@/firebase/DatabaseService", () => ({
  createEvent: jest.fn(),
  inviteUsersToEvent: jest.fn(),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("NotFound Page", () => {
  it("renders the title", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "title"
    );
  });

  it("renders the description", () => {
    render(<NotFound />);
    expect(screen.getByText("description")).toBeInTheDocument();
  });

  it("renders the back button with correct text", () => {
    render(<NotFound />);
    expect(screen.getByRole("button")).toHaveTextContent("backButton");
  });

  it("renders the back button with correct class", () => {
    render(<NotFound />);
    expect(screen.getByRole("button")).toHaveClass("button");
  });

  it("renders the link to the home page", () => {
    render(<NotFound />);
    const link = screen.getByRole("link", { name: "backButton" });
    expect(link).toHaveAttribute("href", "/");
  });
});
