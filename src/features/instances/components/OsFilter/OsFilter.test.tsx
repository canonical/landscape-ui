import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FILTERS } from "../../constants";
import OsFilter from "./OsFilter";

const options = FILTERS.os.type === "multi-select" ? FILTERS.os.options : [];
const label = "OS";

const props: ComponentProps<typeof OsFilter> = {
  options,
  label,
  inline: false,
};

const optionCount = options.reduce(
  (count, option) => count + 1 + (option.options?.length ?? 0),
  0,
);

describe("OsFilter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders filter label and options", async () => {
    renderWithProviders(<OsFilter {...props} />);

    const toggle = screen.getByRole("button", { name: label });
    expect(toggle).toBeInTheDocument();

    await userEvent.click(toggle);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(optionCount);
  });

  it("selects an OS option", async () => {
    renderWithProviders(<OsFilter {...props} />);
    await userEvent.click(screen.getByRole("button", { name: label }));

    const optionCheckbox = screen.getByRole("checkbox", {
      name: options[1].label,
    });

    await userEvent.click(optionCheckbox);

    const badge = screen.getByText("1");
    expect(badge).toBeInTheDocument();
  });

  it("supports inline prop", async () => {
    renderWithProviders(<OsFilter {...props} inline />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(optionCount);
  });
});
