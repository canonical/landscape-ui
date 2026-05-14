import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import CellInput from "./CellInput";

describe("CellInput", () => {
  const user = userEvent.setup();

  it("renders with the initial value", () => {
    renderWithProviders(
      <CellInput value="hello" onChange={vi.fn()} label="Name" />,
    );

    expect(screen.getByDisplayValue("hello")).toBeInTheDocument();
  });

  it("updates its value when typing", async () => {
    renderWithProviders(<CellInput value="" onChange={vi.fn()} label="Name" />);

    const input = screen.getByRole("textbox");
    await user.type(input, "world");

    expect(screen.getByDisplayValue("world")).toBeInTheDocument();
  });

  it("calls onChange with the current value on blur", async () => {
    const onChange = vi.fn();

    renderWithProviders(
      <CellInput value="initial" onChange={onChange} label="Name" />,
    );

    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "updated");
    await user.tab();

    expect(onChange).toHaveBeenCalledWith("updated");
  });

  it("calls onChange with initial value on blur without typing", async () => {
    const onChange = vi.fn();

    renderWithProviders(
      <CellInput value="initial" onChange={onChange} label="Name" />,
    );

    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.tab();

    expect(onChange).toHaveBeenCalledWith("initial");
  });
});
