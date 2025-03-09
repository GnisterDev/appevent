import React from "react";
import { render, fireEvent } from "@testing-library/react";
import LanguageSwitch from "@/components/UI/LanguageSwitch";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(),
}));

jest.mock("lucide-react", () => ({
  Globe: () => "",
}));

describe("LanguageSwitch", () => {
  const mockRouter = { refresh: jest.fn() };
  const mockTranslations = jest.fn().mockReturnValue("Language");

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useTranslations as jest.Mock).mockReturnValue(mockTranslations);
    (Cookies.get as jest.Mock).mockReturnValue("no");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default locale", () => {
    const { getByText } = render(<LanguageSwitch />);
    expect(getByText("Language")).toBeInTheDocument();
  });

  it("switches language and updates cookie on click", () => {
    const { getByText } = render(<LanguageSwitch />);
    const languageSwitch = getByText("Language");

    fireEvent.click(languageSwitch);

    expect(Cookies.set).toHaveBeenCalledWith("locale", "en");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("has same language when clicked twice", () => {
    const { getByText } = render(<LanguageSwitch />);
    const languageSwitch = getByText("Language");

    fireEvent.click(languageSwitch);
    fireEvent.click(languageSwitch);

    expect(Cookies.set).toHaveBeenCalledWith("locale", "no");
    expect(mockRouter.refresh).toHaveBeenCalledTimes(2);
  });

  it("sets the locale from cookies on mount", () => {
    (Cookies.get as jest.Mock).mockReturnValue("en");
    render(<LanguageSwitch />);
    expect(Cookies.get).toHaveBeenCalledWith("locale");
  });

  it("defaults to no when no cookie", () => {
    (Cookies.get as jest.Mock).mockReturnValue(undefined); // Simulate no cookie set

    const { getByText } = render(<LanguageSwitch />);

    expect(Cookies.get).toHaveBeenCalledWith("locale"); // Ensure it's checking the cookie
    expect(getByText("Language")).toBeInTheDocument(); // Ensure component still renders
  });
});
