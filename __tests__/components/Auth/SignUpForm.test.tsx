import React from "react";
import { render, screen, fireEvent, waitFor } from "@/test-utils";
import SignUpForm from "@/components/auth/SignUpForm";
import { useSignup } from "@/firebase/AuthService";
import { useRouter } from "next/navigation";
import messages from "messages/no.json";

// Mock the modules we need
jest.mock("@/firebase/AuthService", () => ({
  useSignup: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SignUpForm", () => {
  const mockPush = jest.fn();
  const mockUseSignup = useSignup as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;

  // Get the actual translated strings from the messages file
  const translations = {
    title: messages.Auth.SignUp.form.title,
    subtitle: messages.Auth.SignUp.form.subtitle,
    name: messages.Auth.name,
    email: messages.Auth.email,
    password: messages.Auth.password,
    namePlaceholder: messages.Auth.Placeholder.name,
    emailPlaceholder: messages.Auth.Placeholder.email,
    passwordPlaceholder: messages.Auth.Placeholder.password,
    signUpButton: messages.Auth.SignUp.form.title,
    prompt: messages.Auth.SignUp.form.prompt,
    signInLink: messages.Auth.SignIn.form.title,
  };

  beforeEach(() => {
    // Setup mocks before each test
    mockUseRouter.mockReturnValue({
      push: mockPush,
    });
    mockUseSignup.mockClear();
    mockPush.mockClear();
  });

  it("renders the sign-up form correctly", () => {
    render(<SignUpForm />);

    // Check if title is rendered
    expect(
      screen.getByRole("heading", { name: translations.title })
    ).toBeInTheDocument();

    // Check if form inputs are rendered
    expect(
      screen.getByPlaceholderText(translations.namePlaceholder)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(translations.emailPlaceholder)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(translations.passwordPlaceholder)
    ).toBeInTheDocument();

    // Check if the sign-up button is rendered
    expect(
      screen.getByRole("button", { name: translations.signUpButton })
    ).toBeInTheDocument();

    // Check if the sign-in link is rendered
    expect(screen.getByText(translations.signInLink)).toBeInTheDocument();
  });

  it("updates form data when inputs change", () => {
    render(<SignUpForm />);

    const nameInput = screen.getByPlaceholderText(translations.namePlaceholder);
    const emailInput = screen.getByPlaceholderText(
      translations.emailPlaceholder
    );
    const passwordInput = screen.getByPlaceholderText(
      translations.passwordPlaceholder
    );

    // Simulate user input
    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Check if the input values are updated
    expect(nameInput).toHaveValue("Test User");
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("calls useSignup and redirects when form is submitted successfully", async () => {
    mockUseSignup.mockResolvedValue(undefined); // Mock successful signup

    render(<SignUpForm />);

    const nameInput = screen.getByPlaceholderText(translations.namePlaceholder);
    const emailInput = screen.getByPlaceholderText(
      translations.emailPlaceholder
    );
    const passwordInput = screen.getByPlaceholderText(
      translations.passwordPlaceholder
    );

    // Fill the form
    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Submit the form
    const form = screen.getByRole("button", {
      name: translations.signUpButton,
    });
    fireEvent.click(form);

    // Wait for the async call to resolve
    await waitFor(() => {
      expect(mockUseSignup).toHaveBeenCalledWith({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("logs error when signup fails", async () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    const error = new Error("Signup failed");
    mockUseSignup.mockRejectedValue(error);

    render(<SignUpForm />);

    // Fill the form
    const nameInput = screen.getByPlaceholderText(translations.namePlaceholder);
    const emailInput = screen.getByPlaceholderText(
      translations.emailPlaceholder
    );
    const passwordInput = screen.getByPlaceholderText(
      translations.passwordPlaceholder
    );

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Submit the form
    const form = screen.getByRole("button", {
      name: translations.signUpButton,
    });
    fireEvent.click(form);

    // Wait for the error to be logged
    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(mockPush).not.toHaveBeenCalled();
    });

    consoleLogSpy.mockRestore();
  });

  it("validates required fields", async () => {
    render(<SignUpForm />);

    // Submit form without filling required fields
    const form = screen.getByRole("button", {
      name: translations.signUpButton,
    });
    fireEvent.click(form);

    // Check if useSignup was not called (form validation prevented submission)
    await waitFor(() => {
      expect(mockUseSignup).not.toHaveBeenCalled();
    });
  });
});
