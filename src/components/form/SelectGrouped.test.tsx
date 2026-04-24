import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import SelectGrouped from "./SelectGrouped";
import type { groupedOption } from "./SelectGrouped";

const groupedOptions: groupedOption[] = [
  {
    optGroup: "Group A",
    options: [
      { label: "Option 1", value: "opt1" },
      { label: "Option 2", value: "opt2" },
    ],
  },
  {
    optGroup: "Group B",
    options: [
      { label: "Option 3", value: "opt3" },
      { label: "Option 4", value: "opt4" },
    ],
  },
];

describe("SelectGrouped", () => {
  const user = userEvent.setup();

  it("renders grouped options correctly", () => {
    render(
      <SelectGrouped
        groupedOptions={groupedOptions}
        name="test-select"
        group=""
        option=""
        onChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("option", { name: "Option 1" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Option 2" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Option 3" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Option 4" }),
    ).toBeInTheDocument();
  });

  it("renders a label when provided", () => {
    render(
      <SelectGrouped
        groupedOptions={groupedOptions}
        name="test-select"
        group=""
        option=""
        onChange={vi.fn()}
        label="Select an option"
      />,
    );

    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("does not render a label when not provided", () => {
    const { container } = render(
      <SelectGrouped
        groupedOptions={groupedOptions}
        name="test-select"
        group=""
        option=""
        onChange={vi.fn()}
      />,
    );

    expect(container.querySelector("label")).not.toBeInTheDocument();
  });

  it("renders an empty option when emptyOption is enabled", () => {
    render(
      <SelectGrouped
        groupedOptions={groupedOptions}
        name="test-select"
        group=""
        option=""
        onChange={vi.fn()}
        emptyOption={{ enabled: true, label: "Select..." }}
      />,
    );

    expect(
      screen.getByRole("option", { name: "Select..." }),
    ).toBeInTheDocument();
  });

  it("does not render an empty option when emptyOption is disabled", () => {
    render(
      <SelectGrouped
        groupedOptions={groupedOptions}
        name="test-select"
        group=""
        option=""
        onChange={vi.fn()}
        emptyOption={{ enabled: false }}
      />,
    );

    expect(screen.queryByRole("option", { name: "" })).not.toBeInTheDocument();
  });

  it("calls onChange with correct group and value when option selected", async () => {
    const onChange = vi.fn();
    render(
      <SelectGrouped
        groupedOptions={groupedOptions}
        name="test-select"
        group=""
        option=""
        onChange={onChange}
        label="Test"
      />,
    );

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "Group A/opt1");

    expect(onChange).toHaveBeenCalledWith("opt1", "Group A");
  });

  it("disables the select when disabled prop is true", () => {
    render(
      <SelectGrouped
        groupedOptions={groupedOptions}
        name="test-select"
        group=""
        option=""
        onChange={vi.fn()}
        disabled
      />,
    );

    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("renders an error message when error prop is provided", () => {
    render(
      <SelectGrouped
        groupedOptions={groupedOptions}
        name="test-select"
        group=""
        option=""
        onChange={vi.fn()}
        error="This field is required"
      />,
    );

    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });

  it("marks label as required when required prop is set", () => {
    const { container } = render(
      <SelectGrouped
        groupedOptions={groupedOptions}
        name="test-select"
        group=""
        option=""
        onChange={vi.fn()}
        label="Required field"
        required
      />,
    );

    const label = container.querySelector("label");
    expect(label).toHaveClass("is-required");
  });

  it("is hidden when hidden prop is true", () => {
    render(
      <SelectGrouped
        groupedOptions={groupedOptions}
        name="test-select"
        group=""
        option=""
        onChange={vi.fn()}
        hidden
      />,
    );

    expect(screen.getByRole("combobox", { hidden: true })).not.toBeVisible();
  });

  it("uses custom id when provided", () => {
    render(
      <SelectGrouped
        groupedOptions={groupedOptions}
        name="test-select"
        group=""
        option=""
        onChange={vi.fn()}
        id="custom-id"
        label="My Label"
      />,
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("id", "custom-id");
  });

  it("renders an empty option with empty string label when label is not provided", () => {
    const { container } = render(
      <SelectGrouped
        groupedOptions={groupedOptions}
        name="test-select"
        group=""
        option=""
        onChange={vi.fn()}
        emptyOption={{ enabled: true }}
      />,
    );

    const emptyOption = container.querySelector('option[value=""]');
    expect(emptyOption).toBeInTheDocument();
    expect(emptyOption?.textContent).toBe("");
  });

  it("sets selected value when group and option match", () => {
    render(
      <SelectGrouped
        groupedOptions={groupedOptions}
        name="test-select"
        group="Group A"
        option="opt1"
        onChange={vi.fn()}
      />,
    );

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("Group A/opt1");
  });
});
