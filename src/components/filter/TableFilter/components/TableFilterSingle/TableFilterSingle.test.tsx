import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect } from "vitest";
import classes from "../../TableFilter.module.scss";
import type { GroupedOption } from "../../types";
import TableFilterSingle from "./TableFilterSingle";

const options = [
  {
    label: "Test option 1",
    value: "test1",
  },
  {
    label: "Test option 2",
    value: "test2",
  },
  {
    label: "Test option 3",
    value: "test3",
  },
] as const satisfies GroupedOption[];

describe("Filter with single selection", () => {
  const user = userEvent.setup();

  const singleSelectionFilterOptions = [
    {
      label: "Select option",
      value: "",
    },
    ...options,
  ] as const satisfies GroupedOption[];

  const filterLabel = "Single selection filter";

  const singleFilterProps: ComponentProps<typeof TableFilterSingle> = {
    type: "single",
    label: filterLabel,
    options: singleSelectionFilterOptions,
    onItemSelect: vi.fn(),
    selectedItem: singleSelectionFilterOptions[0].value,
  };

  it("should render options for single selection correctly", async () => {
    render(<TableFilterSingle {...singleFilterProps} />);

    const button = screen.getByRole("button");

    expect(button).toHaveTextContent(filterLabel);

    await user.click(button);

    expect(screen.getAllByRole("listitem")).toHaveLength(
      singleSelectionFilterOptions.length,
    );

    for (const { label, value } of singleSelectionFilterOptions) {
      const element = screen.getByText(label);

      if (value === singleSelectionFilterOptions[0].value) {
        expect(element).not.toHaveRole("button");

        continue;
      }

      expect(element).toHaveRole("button");
    }
  });

  it("should close single filter when clicking option", async () => {
    render(<TableFilterSingle {...singleFilterProps} />);

    const button = screen.getByRole("button");

    await user.click(button);

    expect(screen.getByRole("list")).toBeInTheDocument();

    await user.click(screen.getByText(options[1].label));

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("should render a divider between different option groups", async () => {
    const groupedOptions = singleSelectionFilterOptions.map(
      (option, index) => ({
        ...option,
        group: index > 0 ? "Group 2" : "Group 1",
      }),
    );

    render(
      <TableFilterSingle {...singleFilterProps} options={groupedOptions} />,
    );

    await user.click(screen.getByRole("button"));

    const listItems = screen.getAllByRole("listitem");

    listItems.forEach((listItem, index) => {
      const groupedOption = groupedOptions[index];
      assert(groupedOption);
      const { group } = groupedOption;
      const nextIndex = index + 1;

      if (
        group &&
        groupedOptions[nextIndex] !== undefined &&
        groupedOptions[nextIndex].group !== group
      ) {
        expect(listItem).toHaveClass(classes.separated);
      } else {
        expect(listItem).not.toHaveClass(classes.separated);
      }
    });
  });

  it("should render disabled options", async () => {
    const disabledOptions = [
      singleSelectionFilterOptions[0],
      singleSelectionFilterOptions[2],
    ];

    render(
      <TableFilterSingle
        {...singleFilterProps}
        disabledOptions={disabledOptions}
      />,
    );

    await user.click(screen.getByRole("button"));

    for (const { label, value } of singleSelectionFilterOptions) {
      if (value === singleFilterProps.selectedItem) {
        continue;
      }

      const button = screen.getByRole("button", { name: label });

      if (disabledOptions.some((option) => option.value === value)) {
        expect(button).toHaveAttribute("aria-disabled", "true");
      } else {
        expect(button).not.toHaveAttribute("aria-disabled");
      }
    }
  });

  it("should render a badge when selected option has truthy value", async () => {
    const { rerender } = render(
      <TableFilterSingle {...singleFilterProps} hasBadge />,
    );

    const button = screen.getByRole("button");

    expect(button).toHaveTextContent(filterLabel);
    expect(within(button).queryByText("1")).not.toBeInTheDocument();

    await user.click(button);

    await user.click(screen.getByText(options[0].label));

    rerender(
      <TableFilterSingle
        {...singleFilterProps}
        selectedItem={options[0].value}
        hasBadge
      />,
    );

    expect(within(button).getByRole("img")).toBeInTheDocument();
  });

  it("should render search box", async () => {
    const onSearch = vi.fn();

    render(<TableFilterSingle {...singleFilterProps} onSearch={onSearch} />);

    await user.click(screen.getByRole("button"));

    await user.type(screen.getByRole("searchbox"), "test");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearch).toHaveBeenCalledWith("test");
  });

  it("renders inline", () => {
    render(<TableFilterSingle {...singleFilterProps} inline />);

    for (const { label } of options) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("can use the selected option as the label", async () => {
    const option = options.find(
      ({ label }) => label !== singleFilterProps.label,
    );
    assert(option);

    render(
      <TableFilterSingle
        {...singleFilterProps}
        showSelectionOnToggleLabel
        selectedItem={option.value}
      />,
    );

    expect(screen.getByText(option.label)).toBeInTheDocument();
  });
});
