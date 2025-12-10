import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import TableFilterChipsBase from "./TableFilterChipsBase";

type Filter = ComponentProps<typeof TableFilterChipsBase>["filters"][number];

describe("TableFilterChipsBase", () => {
  const user = userEvent.setup();

  const singleFilter: Filter = {
    label: "Label 1",
    item: "Item 1",
    clear: vi.fn(),
  };

  const props = {
    filters: [
      singleFilter,
      {
        label: "Label 2",
        multiple: true,
        items: [
          {
            label: "Item 1",
            value: "item-1",
          },
          {
            label: "Item 2",
            value: "item-2",
          },
        ],
        clear: vi.fn(),
        remove: vi.fn(),
      },
    ],
  } satisfies ComponentProps<typeof TableFilterChipsBase>;

  it("renders nothing", () => {
    renderWithProviders(<TableFilterChipsBase filters={[]} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders one chip", () => {
    renderWithProviders(<TableFilterChipsBase filters={[singleFilter]} />);

    assert(!singleFilter.multiple);

    expect(
      screen.getByText(`${singleFilter.label}: ${singleFilter.item}`),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Clear all filters" }),
    ).not.toBeInTheDocument();
  });

  it("renders multiple chips", () => {
    renderWithProviders(<TableFilterChipsBase {...props} />);

    for (const filter of props.filters) {
      if (filter.multiple) {
        for (const item of filter.items) {
          expect(
            screen.getByText(`${filter.label}: ${item.label}`),
          ).toBeInTheDocument();
        }
      } else {
        expect(
          screen.getByText(`${filter.label}: ${filter.item}`),
        ).toBeInTheDocument();
      }
    }

    expect(
      screen.getByRole("button", { name: "Clear all filters" }),
    ).toBeInTheDocument();
  });

  it("removes a filter", async () => {
    renderWithProviders(<TableFilterChipsBase {...props} />);

    for (const filter of props.filters) {
      if (filter.multiple) {
        for (const item of filter.items) {
          const chip = screen.getByText(
            `${filter.label}: ${item.label}`,
          ).parentElement;

          assert(chip);
          await user.click(within(chip).getByRole("button"));
          expect(filter.remove).toHaveBeenLastCalledWith(item.value);
        }
      }
    }
  });

  it("clears all filters", async () => {
    renderWithProviders(<TableFilterChipsBase {...props} />);

    await user.click(screen.getByRole("button", { name: "Clear all filters" }));

    for (const filter of props.filters) {
      expect(filter.clear).toHaveBeenCalledExactlyOnceWith();
    }
  });
});
