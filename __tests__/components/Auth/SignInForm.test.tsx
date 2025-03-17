import React from "react";
import { render, screen, fireEvent, waitFor } from "@/test-utils";
import SignInForm from "@/components/auth/SignInForm";
import { useLogin } from "@/firebase/AuthService";
import { useRouter } from "next/navigation";
import messages from "messages/no.json";

// Mock the modules we need
jest.mock("@/firebase/AuthService", () => ({
  useLogin: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SignInForm", () => {
  const mockPush = jest.fn();
  const mockUseLogin = useLogin as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;

  // Get the actual translated strings from the messages file
  const translations = {
    title: messages.Auth.SignIn.form.title,
    subtitle: messages.Auth.SignIn.form.subtitle,
    email: messages.Auth.email,
    password: messages.Auth.password,
    emailPlaceholder: messages.Auth.Placeholder.email,
    passwordPlaceholder: messages.Auth.Placeholder.password,
    signInButton: messages.Auth.SignIn.form.title,
    prompt: messages.Auth.SignIn.form.prompt,
    signUpLink: messages.Auth.SignUp.form.title,
  };

  beforeEach(() => {
    // Setup mocks before each test
    mockUseRouter.mockReturnValue({
      push: mockPush,
    });
    mockUseLogin.mockClear();
    mockPush.mockClear();
  });

  it("renders the sign-in form correctly", () => {
    render(<SignInForm />);

    // Check if title is rendered
    expect(
      screen.getByRole("heading", { name: translations.title })
    ).toBeInTheDocument();

    // Check if form inputs are rendered
    expect(
      screen.getByPlaceholderText(translations.emailPlaceholder)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(translations.passwordPlaceholder)
    ).toBeInTheDocument();

    // Check if the sign-in button is rendered
    expect(
      screen.getByRole("button", { name: translations.signInButton })
    ).toBeInTheDocument();

    // Check if the sign-up link is rendered
    expect(screen.getByText(translations.signUpLink)).toBeInTheDocument();
  });

  it("updates form data when inputs change", () => {
    render(<SignInForm />);

    const emailInput = screen.getByPlaceholderText(
      translations.emailPlaceholder
    );
    const passwordInput = screen.getByPlaceholderText(
      translations.passwordPlaceholder
    );

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Check if the input values are updated
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("calls useLogin and redirects when form is submitted successfully", async () => {
    mockUseLogin.mockResolvedValue(undefined); // Mock successful login

    render(<SignInForm />);

    const emailInput = screen.getByPlaceholderText(
      translations.emailPlaceholder
    );
    const passwordInput = screen.getByPlaceholderText(
      translations.passwordPlaceholder
    );

    // Fill the form
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Submit the form
    const form = screen.getByRole("button", {
      name: translations.signInButton,
    });
    fireEvent.click(form);

    // Wait for the async call to resolve
    await waitFor(() => {
      expect(mockUseLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("logs error when login fails", async () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    const error = new Error("Login failed");
    mockUseLogin.mockRejectedValue(error);

    render(<SignInForm />);

    // Fill the form
    const emailInput = screen.getByPlaceholderText(
      translations.emailPlaceholder
    );
    const passwordInput = screen.getByPlaceholderText(
      translations.passwordPlaceholder
    );

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Submit the form
    const form = screen.getByRole("button", {
      name: translations.signInButton,
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
    render(<SignInForm />);

    // Submit form without filling required fields
    const form = screen.getByRole("button", {
      name: translations.signInButton,
    });
    fireEvent.click(form);

    // Check if useLogin was not called (form validation prevented submission)
    await waitFor(() => {
      expect(mockUseLogin).not.toHaveBeenCalled();
    });
  });

  it("navigates to signup page when sign up link is clicked", () => {
    render(<SignInForm />);

    const signUpLink = screen.getByText(translations.signUpLink);
    expect(signUpLink).toHaveAttribute("href", "/signup");
  });
});
