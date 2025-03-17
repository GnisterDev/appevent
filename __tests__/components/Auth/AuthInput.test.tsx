import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AuthInput from "@/components/auth/AuthInput";

describe("AuthInput Component", () => {
  const mockOnChange = jest.fn();

  const defaultProps = {
    label: "Username",
    type: "text",
    name: "username",
    value: "",
    onChange: mockOnChange,
    placeholder: "Enter your username",
    required: true,
    icon: <span>🔒</span>,
  };

  it("renders the input with the correct label", () => {
    render(<AuthInput {...defaultProps} />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
  });

  it("renders the input with the correct placeholder", () => {
    render(<AuthInput {...defaultProps} />);
    expect(
      screen.getByPlaceholderText("Enter your username")
    ).toBeInTheDocument();
  });

  it("calls onChange when the input value changes", () => {
    render(<AuthInput {...defaultProps} />);
    const input = screen.getByPlaceholderText("Enter your username");
    fireEvent.change(input, { target: { value: "testuser" } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("renders the icon if provided", () => {
    render(<AuthInput {...defaultProps} />);
    expect(screen.getByText("🔒")).toBeInTheDocument();
  });

  it("marks the input as required if the required prop is true", () => {
    render(<AuthInput {...defaultProps} />);
    const input = screen.getByPlaceholderText("Enter your username");
    expect(input).toBeRequired();
  });

  it("renders the input with the correct type", () => {
    render(<AuthInput {...defaultProps} />);
    const input = screen.getByPlaceholderText("Enter your username");
    expect(input).toHaveAttribute("type", "text");
  });
});
