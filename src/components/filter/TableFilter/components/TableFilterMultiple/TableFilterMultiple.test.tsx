import { renderWithProviders } from "@/tests/render";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect } from "vitest";
import classes from "../../TableFilter.module.scss";
import type { GroupedOption } from "../../types";
import TableFilterMultiple from "./TableFilterMultiple";

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

describe("Filter with multiple selection", () => {
  const filterLabel = "Multiple selection filter";

  const multipleSelectionProps: ComponentProps<typeof TableFilterMultiple> = {
    type: "multiple",
    label: filterLabel,
    options,
    onItemsSelect: vi.fn(),
    selectedItems: [],
  };

  it("should render options for multiple selection correctly", async () => {
    const { rerender } = render(
      <TableFilterMultiple {...multipleSelectionProps} />,
    );

    const button = screen.getByRole("button");

    expect(button).toHaveTextContent(filterLabel);

    await userEvent.click(button);

    expect(screen.getAllByRole("listitem")).toHaveLength(options.length);
    expect(
      screen.getByRole("button", { name: "Select all" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();

    await options.reduce(async (accPromise, { label, value }) => {
      const acc = [...(await accPromise)];

      rerender(
        <TableFilterMultiple {...multipleSelectionProps} selectedItems={acc} />,
      );

      const checkbox = screen.getByRole("checkbox", { name: label });

      expect(checkbox).not.toBeChecked();

      await userEvent.click(checkbox);

      acc.push(value);

      expect(multipleSelectionProps.onItemsSelect).toHaveBeenCalledWith(acc);

      return acc;
    }, Promise.resolve(multipleSelectionProps.selectedItems));

    await options.reduce(
      async (accPromise, { label, value }) => {
        const acc = [...(await accPromise)];

        rerender(
          <TableFilterMultiple
            {...multipleSelectionProps}
            selectedItems={acc}
          />,
        );

        const checkbox = screen.getByRole("checkbox", { name: label });

        expect(checkbox).toBeChecked();

        const newAcc = acc.filter((option) => option !== value);

        await userEvent.click(checkbox);

        expect(multipleSelectionProps.onItemsSelect).toHaveBeenCalledWith(
          newAcc,
        );

        return newAcc;
      },
      Promise.resolve(options.map(({ value }) => value)),
    );

    await userEvent.click(screen.getByRole("button", { name: "Select all" }));

    expect(multipleSelectionProps.onItemsSelect).toHaveBeenCalledWith(
      options.map(({ value }) => value),
    );

    await userEvent.click(screen.getByRole("button", { name: "Clear" }));

    expect(multipleSelectionProps.onItemsSelect).toHaveBeenCalledWith([]);
  });

  it("should render a divider between different option groups", async () => {
    const groupedOptions = options.map((option, index) => ({
      ...option,
      group: index > 0 ? "Group 2" : "Group 1",
    }));

    render(
      <TableFilterMultiple
        {...multipleSelectionProps}
        options={groupedOptions}
      />,
    );

    await userEvent.click(screen.getByRole("button"));

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
    const disabledOptions = [options[0], options[2]];

    render(
      <TableFilterMultiple
        {...multipleSelectionProps}
        disabledOptions={disabledOptions}
      />,
    );

    await userEvent.click(screen.getByRole("button"));

    for (const { label, value } of options) {
      const checkbox = screen.getByRole("checkbox", { name: label });

      if (disabledOptions.some((option) => option.value === value)) {
        expect(checkbox).toBeDisabled();
      } else {
        expect(checkbox).not.toBeDisabled();
      }
    }
  });

  it("should render a badge with the number of selected option, if any", async () => {
    const { rerender } = render(
      <TableFilterMultiple {...multipleSelectionProps} hasBadge />,
    );

    const button = screen.getByRole("button");

    expect(button).toHaveTextContent(filterLabel);

    for (let i = 0; i < options.length + 1; i++) {
      expect(within(button).queryByText(i)).not.toBeInTheDocument();
    }

    await userEvent.click(button);

    await options.reduce(async (accPromise, { label, value }) => {
      const acc = [...(await accPromise)];

      const checkbox = screen.getByRole("checkbox", { name: label });

      expect(checkbox).not.toBeChecked();

      acc.push(value);

      await userEvent.click(checkbox);

      expect(multipleSelectionProps.onItemsSelect).toHaveBeenCalledWith(acc);

      rerender(
        <TableFilterMultiple
          {...multipleSelectionProps}
          selectedItems={acc}
          hasBadge
        />,
      );

      expect(within(button).getByText(acc.length)).toBeInTheDocument();

      return acc;
    }, Promise.resolve(multipleSelectionProps.selectedItems));
  });

  it("should render search box", async () => {
    const onSearch = vi.fn();

    render(
      <TableFilterMultiple {...multipleSelectionProps} onSearch={onSearch} />,
    );

    await userEvent.click(screen.getByRole("button"));

    await userEvent.type(screen.getByRole("searchbox"), "test");
    await userEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearch).toHaveBeenCalledWith("test");
  });

  it("should render selected options number", async () => {
    const { rerender } = render(
      <TableFilterMultiple {...multipleSelectionProps} showSelectedItemCount />,
    );

    await userEvent.click(screen.getByRole("button"));

    expect(
      screen.getByRole("button", { name: "Select all" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Clear" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        `${multipleSelectionProps.selectedItems.length} of ${options.length} selected`,
      ),
    ).toBeInTheDocument();

    await options.reduce(async (accPromise, { value }) => {
      const acc = [...(await accPromise)];

      acc.push(value);

      rerender(
        <TableFilterMultiple
          {...multipleSelectionProps}
          selectedItems={acc}
          showSelectedItemCount
        />,
      );

      expect(
        screen.getByText(`${acc.length} of ${options.length} selected`),
      ).toBeInTheDocument();

      return acc;
    }, Promise.resolve(multipleSelectionProps.selectedItems));
  });

  it("renders inline", () => {
    renderWithProviders(
      <TableFilterMultiple {...multipleSelectionProps} inline />,
    );

    for (const { label } of options) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });
});
