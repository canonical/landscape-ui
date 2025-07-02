import type { GroupedOption } from "@/components/filter";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe } from "vitest";
import TableFilter from "./TableFilter";

describe("TableFilter", () => {
  it("should render multiple selection filter correctly", async () => {
    const options: GroupedOption[] = [
      {
        label: "Test option 1",
        value: "test1",
      },
      { label: "Test option 2", value: "test2" },
      { label: "Test option 3", value: "test3" },
    ];
    const filterLabel = "Multiple selection filter";
    const multipleSelectionProps: ComponentProps<typeof TableFilter> = {
      type: "multiple",
      label: filterLabel,
      options,
      onItemsSelect: vi.fn(),
      selectedItems: [],
    };

    render(<TableFilter {...multipleSelectionProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent(filterLabel);
    await userEvent.click(button);
    expect(screen.getAllByRole("listitem")).toHaveLength(options.length);
    expect(
      screen.getByRole("button", { name: "Select all" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });

  it("should render single selection filter correctly", async () => {
    const options: GroupedOption[] = [
      {
        label: "Test option 1",
        value: "test1",
      },
      { label: "Test option 2", value: "test2" },
      { label: "Test option 3", value: "test3" },
    ];
    const filterLabel = "Single selection filter";
    const singleSelectionProps: ComponentProps<typeof TableFilter> = {
      type: "single",
      label: filterLabel,
      options,
      onItemSelect: vi.fn(),
      selectedItem: "",
    };

    render(<TableFilter {...singleSelectionProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent(filterLabel);
    await userEvent.click(button);
    expect(screen.getAllByRole("listitem")).toHaveLength(options.length);
  });

  it("should render custom filter correctly", async () => {
    const filterLabel = "Custom filter";
    const customFilterProps: ComponentProps<typeof TableFilter> = {
      type: "custom",
      customComponent: () => <div>Custom Component</div>,
      label: filterLabel,
    };

    render(<TableFilter {...customFilterProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent(filterLabel);
    await userEvent.click(button);
    expect(screen.getByText("Custom Component")).toBeInTheDocument();
  });
});
