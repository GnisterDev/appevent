import React from "react";
import { render, screen } from "@/test-utils";
import SignIn from "@/components/auth/SignInForm";

describe("SignIn Component", () => {
  it("renders a heading", () => {
    render(<SignIn />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
