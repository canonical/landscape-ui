import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FILTERS } from "../../constants";
import OsFilter from "./OsFilter";

const options = FILTERS.os.type === "select" ? FILTERS.os.options : [];
const label = "OS";

const props: ComponentProps<typeof OsFilter> = {
  options,
  label,
  inline: false,
};

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
    expect(listItems).toHaveLength(options.length);
  });

  it("selects an OS option", async () => {
    renderWithProviders(<OsFilter {...props} />);
    await userEvent.click(screen.getByRole("button", { name: label }));

    const optionBtn = screen.getByRole("button", {
      name: options[1].label,
    });

    await userEvent.click(optionBtn);

    const svgIcon = screen.getByRole("img");
    expect(svgIcon).toBeInTheDocument();
  });

  it("supports inline prop", async () => {
    renderWithProviders(<OsFilter {...props} inline />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(options.length);
  });
});
