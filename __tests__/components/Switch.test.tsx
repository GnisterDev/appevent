import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Switch from "@/components/Switch";

describe("Switch component", () => {
  test("renders correctly with default props", () => {
    const { getByRole } = render(<Switch />);
    const switchElement = getByRole("switch");
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveAttribute("aria-checked", "false");
  });

  test("renders correctly when 'on' prop is true", () => {
    const { getByRole } = render(<Switch on={true} />);
    const switchElement = getByRole("switch");
    expect(switchElement).toHaveAttribute("aria-checked", "true");
  });

  test("toggles state when clicked", () => {
    const { getByRole } = render(<Switch />);
    const switchElement = getByRole("switch");

    fireEvent.click(switchElement);
    expect(switchElement).toHaveAttribute("aria-checked", "true");

    fireEvent.click(switchElement);
    expect(switchElement).toHaveAttribute("aria-checked", "false");
  });

  test("calls onClick prop when clicked", () => {
    const onClickMock = jest.fn();
    const { getByRole } = render(<Switch onClick={onClickMock} />);
    const switchElement = getByRole("switch");

    fireEvent.click(switchElement);
    expect(onClickMock).toHaveBeenCalledTimes(1);

    fireEvent.click(switchElement);
    expect(onClickMock).toHaveBeenCalledTimes(2);
  });
});
