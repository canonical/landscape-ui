import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import ColumnFilter from "./ColumnFilter";
import type { ColumnFilterOption } from "./types";

const options: ColumnFilterOption[] = [
  { label: "Name", value: "name", canBeHidden: true },
  { label: "Status", value: "status", canBeHidden: false },
  { label: "Version", value: "version", canBeHidden: true },
];

describe("ColumnFilter", () => {
  it("renders the column filter button with label", () => {
    renderWithProviders(<ColumnFilter label="Columns" options={options} />);

    expect(screen.getByText("Columns")).toBeInTheDocument();
  });

  it("renders with label when options are empty", () => {
    renderWithProviders(<ColumnFilter label="Columns" options={[]} />);

    expect(screen.getByText("Columns")).toBeInTheDocument();
  });

  it("starts right-aligned before the menu is first opened", () => {
    renderWithProviders(<ColumnFilter label="Columns" options={options} />);

    const menu = screen
      .getByRole("button", { name: "Columns" })
      .closest(".p-contextual-menu");

    expect(menu).toBeInTheDocument();
    expect(menu).not.toHaveClass("p-contextual-menu--left");
    expect(menu).not.toHaveClass("p-contextual-menu--center");
  });

  it("keeps column selection working and required columns disabled", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ColumnFilter label="Columns" options={options} />);

    await user.click(screen.getByRole("button", { name: "Columns" }));

    expect(screen.getByRole("checkbox", { name: "Status" })).toBeDisabled();
    const version = screen.getByRole("checkbox", { name: "Version" });
    expect(version).toBeChecked();

    await user.click(version);

    expect(version).not.toBeChecked();
  });
});
