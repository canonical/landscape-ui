import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ReportLegendRow } from "./ReportLegendTable";
import ReportLegendTable from "./ReportLegendTable";

const rowA: ReportLegendRow = {
  key: "a",
  marker: <span data-testid="marker-a" />,
  label: "First",
  count: 6,
  countHref: "/instances?query=id%3A1",
  onCountActivate: vi.fn(),
  countAriaLabel: "View first",
};
const rowB: ReportLegendRow = {
  key: "b",
  marker: <span data-testid="marker-b" />,
  label: "Second",
  detail: "extra context",
  count: 0,
};
const rows: ReportLegendRow[] = [rowA, rowB];

describe("ReportLegendTable", () => {
  it("renders the column headers", () => {
    renderWithProviders(
      <ReportLegendTable
        variant="dot"
        labelHeader="Status"
        countHeader="Instances"
        rows={rows}
      />,
    );
    const headers = screen
      .getAllByRole("columnheader")
      .map((header) => header.textContent);
    expect(headers).toEqual(["", "Status", "Instances"]);
  });

  it("renders a marker, label and count for each row", () => {
    renderWithProviders(
      <ReportLegendTable
        variant="dot"
        labelHeader="Status"
        countHeader="Instances"
        rows={rows}
      />,
    );
    expect(screen.getByTestId("marker-a")).toBeInTheDocument();
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("renders the count as a deep link when a href is provided", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ReportLegendTable
        variant="dot"
        labelHeader="Status"
        countHeader="Instances"
        rows={rows}
      />,
    );
    const link = screen.getByRole("link", { name: "View first" });
    expect(link).toHaveAttribute("href", "/instances?query=id%3A1");
    await user.click(link);
    expect(rowA.onCountActivate).toHaveBeenCalledTimes(1);
  });

  it("renders a plain count when no href is provided", () => {
    renderWithProviders(
      <ReportLegendTable
        variant="dot"
        labelHeader="Status"
        countHeader="Instances"
        rows={[rowB]}
      />,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders a zero count as plain text even when a href is provided", () => {
    renderWithProviders(
      <ReportLegendTable
        variant="dot"
        labelHeader="Status"
        countHeader="Instances"
        rows={[
          {
            key: "z",
            marker: <span />,
            label: "Zero",
            count: 0,
            countHref: "/instances?query=id%3A9",
            countAriaLabel: "zero",
          },
        ]}
      />,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("exposes row detail through a help icon", () => {
    renderWithProviders(
      <ReportLegendTable
        variant="dot"
        labelHeader="Status"
        countHeader="Instances"
        rows={rows}
      />,
    );
    // rowB carries a detail; rowA does not. The icon is decorative now, so
    // assert on the off-screen help text and icon class instead of role="img".
    expect(
      screen.getByText("Help", { selector: ".u-off-screen" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Second").closest("tr")?.querySelector(".p-icon--help"),
    ).toHaveAttribute("aria-hidden", "true");
  });

  it("renders a header label for the marker column when given", () => {
    renderWithProviders(
      <ReportLegendTable
        variant="bar"
        markerHeader="Instances"
        labelHeader="Status"
        countHeader="Instances"
        rows={rows}
      />,
    );
    const [firstHeader] = screen.getAllByRole("columnheader");
    expect(
      within(firstHeader as HTMLElement).getByText("Instances"),
    ).toBeInTheDocument();
  });
});
