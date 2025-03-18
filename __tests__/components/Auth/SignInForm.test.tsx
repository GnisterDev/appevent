import React from "react";
import { render, screen, fireEvent, waitFor } from "@/test-utils";
import SignInForm from "@/components/auth/SignInForm";
import { useLogin } from "@/firebase/AuthService";
import { useRouter } from "next/navigation";
import messages from "messages/no.json";

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
    mockUseRouter.mockReturnValue({
      push: mockPush,
    });
    mockUseLogin.mockClear();
    mockPush.mockClear();
  });

  it("renders the sign-in form correctly", () => {
    render(<SignInForm />);

    expect(
      screen.getByRole("heading", { name: translations.title })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(translations.emailPlaceholder)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(translations.passwordPlaceholder)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: translations.signInButton })
    ).toBeInTheDocument();

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

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("calls useLogin and redirects when form is submitted successfully", async () => {
    mockUseLogin.mockResolvedValue(undefined);

    render(<SignInForm />);

    const emailInput = screen.getByPlaceholderText(
      translations.emailPlaceholder
    );
    const passwordInput = screen.getByPlaceholderText(
      translations.passwordPlaceholder
    );

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    const form = screen.getByRole("button", {
      name: translations.signInButton,
    });

    fireEvent.click(form);
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

    const emailInput = screen.getByPlaceholderText(
      translations.emailPlaceholder
    );
    const passwordInput = screen.getByPlaceholderText(
      translations.passwordPlaceholder
    );

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    const form = screen.getByRole("button", {
      name: translations.signInButton,
    });

    fireEvent.click(form);
    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(mockPush).not.toHaveBeenCalled();
    });

    consoleLogSpy.mockRestore();
  });

  it("validates required fields", async () => {
    render(<SignInForm />);

    const form = screen.getByRole("button", {
      name: translations.signInButton,
    });

    fireEvent.click(form);
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
