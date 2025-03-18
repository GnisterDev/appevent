import React from "react";
import { render, screen, fireEvent, waitFor } from "@/test-utils";
import SignUpForm from "@/components/auth/SignUpForm";
import { useSignup } from "@/firebase/AuthService";
import { useRouter } from "next/navigation";
import messages from "messages/no.json";

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
    mockUseRouter.mockReturnValue({
      push: mockPush,
    });
    mockUseSignup.mockClear();
    mockPush.mockClear();
  });

  it("renders the sign-up form correctly", () => {
    render(<SignUpForm />);

    expect(
      screen.getByRole("heading", { name: translations.title })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(translations.namePlaceholder)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(translations.emailPlaceholder)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(translations.passwordPlaceholder)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: translations.signUpButton })
    ).toBeInTheDocument();

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

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(nameInput).toHaveValue("Test User");
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("calls useSignup and redirects when form is submitted successfully", async () => {
    mockUseSignup.mockResolvedValue(undefined);

    render(<SignUpForm />);

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

    const form = screen.getByRole("button", {
      name: translations.signUpButton,
    });
    fireEvent.click(form);

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

    const form = screen.getByRole("button", {
      name: translations.signUpButton,
    });
    fireEvent.click(form);

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(mockPush).not.toHaveBeenCalled();
    });

    consoleLogSpy.mockRestore();
  });

  it("validates required fields", async () => {
    render(<SignUpForm />);

    const form = screen.getByRole("button", {
      name: translations.signUpButton,
    });

    fireEvent.click(form);
    await waitFor(() => {
      expect(mockUseSignup).not.toHaveBeenCalled();
    });
  });
});
