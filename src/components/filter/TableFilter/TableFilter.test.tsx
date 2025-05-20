import { render, screen, within } from "@testing-library/react";
import TableFilter from "./TableFilter";
import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import type { GroupedOption } from "@/components/filter";
import { describe } from "vitest";
import classes from "./TableFilter.module.scss";

const options: GroupedOption[] = [
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
];

describe("TableFilter", () => {
  describe("Filter with single selection", () => {
    const singleSelectionFilterOptions = [
      {
        label: "Select option",
        value: "",
      },
      ...options,
    ];

    const filterLabel = "Single selection filter";

    const singleFilterProps: ComponentProps<typeof TableFilter> = {
      multiple: false,
      label: filterLabel,
      options: singleSelectionFilterOptions,
      onItemSelect: vi.fn(),
      selectedItem: singleSelectionFilterOptions[0].value,
    };

    it("should render options for single selection correctly", async () => {
      render(<TableFilter {...singleFilterProps} />);

      const button = screen.getByRole("button");

      expect(button).toHaveTextContent(filterLabel);

      await userEvent.click(button);

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
      render(<TableFilter {...singleFilterProps} />);

      const button = screen.getByRole("button");

      await userEvent.click(button);

      expect(screen.getByRole("list")).toBeInTheDocument();

      await userEvent.click(screen.getByText(options[1].label));

      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("should render a divider between different option groups", async () => {
      const groupedOptions = singleSelectionFilterOptions.map(
        (option, index) => ({
          ...option,
          group: index > 0 ? "Group 2" : "Group 1",
        }),
      );

      render(<TableFilter {...singleFilterProps} options={groupedOptions} />);

      await userEvent.click(screen.getByRole("button"));

      const listItems = screen.getAllByRole("listitem");

      expect(listItems).toHaveLength(groupedOptions.length);

      listItems.forEach((listItem, index) => {
        const { group } = groupedOptions[index];

        if (
          group &&
          groupedOptions[index + 1] !== undefined &&
          groupedOptions[index + 1].group !== group
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
        <TableFilter
          {...singleFilterProps}
          disabledOptions={disabledOptions}
        />,
      );

      await userEvent.click(screen.getByRole("button"));

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
        <TableFilter {...singleFilterProps} hasBadge />,
      );

      const button = screen.getByRole("button");

      expect(button).toHaveTextContent(filterLabel);
      expect(within(button).queryByText("1")).not.toBeInTheDocument();

      await userEvent.click(button);

      await userEvent.click(screen.getByText(options[0].label));

      rerender(
        <TableFilter
          {...singleFilterProps}
          selectedItem={options[0].value}
          hasBadge
        />,
      );

      expect(within(button).getByRole("img")).toBeInTheDocument();
    });

    it("should render search box", async () => {
      const onSearch = vi.fn();

      render(<TableFilter {...singleFilterProps} onSearch={onSearch} />);

      await userEvent.click(screen.getByRole("button"));

      await userEvent.type(screen.getByRole("searchbox"), "test");
      await userEvent.click(screen.getByRole("button", { name: "Search" }));

      expect(onSearch).toHaveBeenCalledWith("test");
    });
  });

  describe("Filter with multiple selection", () => {
    const filterLabel = "Multiple selection filter";

    const multipleSelectionProps: ComponentProps<typeof TableFilter> = {
      multiple: true,
      label: filterLabel,
      options,
      onItemsSelect: vi.fn(),
      selectedItems: [],
    };

    it("should render options for multiple selection correctly", async () => {
      const { rerender } = render(<TableFilter {...multipleSelectionProps} />);

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
          <TableFilter {...multipleSelectionProps} selectedItems={acc} />,
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
            <TableFilter {...multipleSelectionProps} selectedItems={acc} />,
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
        <TableFilter {...multipleSelectionProps} options={groupedOptions} />,
      );

      await userEvent.click(screen.getByRole("button"));

      const listItems = screen.getAllByRole("listitem");

      expect(listItems).toHaveLength(groupedOptions.length);

      listItems.forEach((listItem, index) => {
        const { group } = groupedOptions[index];

        if (
          group &&
          groupedOptions[index + 1] !== undefined &&
          groupedOptions[index + 1].group !== group
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
        <TableFilter
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
        <TableFilter {...multipleSelectionProps} hasBadge />,
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
          <TableFilter
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

      render(<TableFilter {...multipleSelectionProps} onSearch={onSearch} />);

      await userEvent.click(screen.getByRole("button"));

      await userEvent.type(screen.getByRole("searchbox"), "test");
      await userEvent.click(screen.getByRole("button", { name: "Search" }));

      expect(onSearch).toHaveBeenCalledWith("test");
    });

    it("should render selected options number", async () => {
      const { rerender } = render(
        <TableFilter {...multipleSelectionProps} showSelectedItemCount />,
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
          <TableFilter
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
  });
});
