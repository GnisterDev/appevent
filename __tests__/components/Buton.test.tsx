import React from "react";
import { render, screen, fireEvent } from "@/test-utils";
import Button from "@/components/Button";

describe("Button component", () => {
  test("renders button with text", () => {
    render(<Button text="Click me" />);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test("renders button with icon and text", () => {
    const icon = <span data-testid="icon">Icon</span>;
    render(<Button text="Click me" icon={icon} />);
    const buttonElement = screen.getByText(/click me/i);
    const iconElement = screen.getByTestId("icon");
    expect(buttonElement).toBeInTheDocument();
    expect(iconElement).toBeInTheDocument();
  });

  test("applies custom className", () => {
    render(<Button text="Click me" className="custom-class" />);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toHaveClass("custom-class");
  });

  test("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button text="Click me" onClick={handleClick} />);
    const buttonElement = screen.getByText(/click me/i);
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
