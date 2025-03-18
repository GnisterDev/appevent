import React from "react";
import { render } from "@testing-library/react";
import Loading from "@/components/Loading";

jest.mock("lucide-react", () => ({
  LoaderCircle: jest.fn(() => <div>Mocked LoaderCircle</div>),
}));

describe("Loading component", () => {
  it("should render without crashing", () => {
    const { container } = render(<Loading />);
    expect(container).toBeInTheDocument();
  });

  it("should render the LoaderCircle component", () => {
    const { getByText } = render(<Loading />);
    expect(getByText("Mocked LoaderCircle")).toBeInTheDocument();
  });

  it("should apply the correct styles", () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toHaveClass("component");
  });
});
