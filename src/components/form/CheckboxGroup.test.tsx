import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import type { SelectOption } from "@/types/SelectOption";
import CheckboxGroup from "./CheckboxGroup";

const options: SelectOption[] = [
  { label: "Alpha", value: "alpha" },
  { label: "Beta", value: "beta" },
];

describe("CheckboxGroup", () => {
  it("renders label, help, and error message", () => {
    renderWithProviders(
      <CheckboxGroup
        name="groups"
        label="Access groups"
        options={options}
        value={[]}
        onChange={vi.fn()}
        help="Select one or more groups"
        error="Selection is required"
        required
      />,
    );

    expect(screen.getByText("Access groups")).toBeInTheDocument();
    expect(screen.getByText("Select one or more groups")).toBeInTheDocument();
    expect(screen.getByText("Selection is required")).toBeInTheDocument();
  });

  it("adds and removes values when options are toggled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderWithProviders(
      <CheckboxGroup
        name="groups"
        label="Access groups"
        options={options}
        value={["alpha"]}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText("Alpha"));
    expect(onChange).toHaveBeenCalledWith([]);

    await user.click(screen.getByLabelText("Beta"));
    expect(onChange).toHaveBeenCalledWith(["alpha", "beta"]);
  });
});
