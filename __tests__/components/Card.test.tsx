import React from "react";
import { render, screen } from "@/test-utils";
import Card from "../../src/components/Card";

describe("Card Component", () => {
  it("renders the title correctly", () => {
    render(
      <Card title="Test Title" color="blue">
        Test Content
      </Card>
    );
    const titleElement = screen.getByText("Test Title");
    expect(titleElement).toBeInTheDocument();
  });

  it("renders the children content correctly", () => {
    render(
      <Card title="Test Title" color="blue">
        Test Content
      </Card>
    );
    const contentElement = screen.getByText("Test Content");
    expect(contentElement).toBeInTheDocument();
  });

  it("applies the correct background color", () => {
    render(
      <Card title="Test Title" color="blue">
        Test Content
      </Card>
    );
    const cardElement = screen.getByText("Test Title").parentElement;
    expect(cardElement).toHaveStyle({ backgroundColor: "blue" });
  });

  it("applies additional className if provided", () => {
    render(
      <Card title="Test Title" color="blue" className="extra-class">
        Test Content
      </Card>
    );
    const cardElement = screen.getByText("Test Title").parentElement;
    expect(cardElement).toHaveClass("extra-class");
  });
});
