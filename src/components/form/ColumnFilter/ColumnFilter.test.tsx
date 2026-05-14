import { screen } from "@testing-library/react";
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
});
