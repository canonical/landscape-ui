import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { MetricRow } from "./MetricBarTable";
import MetricBarTable from "./MetricBarTable";

const securelyPatched: MetricRow = {
  key: "securely-patched",
  label: "Securely patched",
  count: 6,
  total: 11,
  color: "positive",
  countHref: "/instances?query=id%3A1",
  onCountActivate: vi.fn(),
  countAriaLabel: "View securely patched",
};
const contacted: MetricRow = {
  key: "contacted",
  label: "Contacted",
  count: 0,
  total: 11,
  color: "neutral",
};
const rows: MetricRow[] = [securelyPatched, contacted];

const renderTable = () =>
  renderWithProviders(
    <MetricBarTable labelHeader="Status" countHeader="Instances" rows={rows} />,
  );

describe("MetricBarTable", () => {
  it("renders a row per metric with its label and count", () => {
    renderTable();
    expect(screen.getByText("Securely patched")).toBeInTheDocument();
    expect(screen.getByText("Contacted")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View securely patched" }),
    ).toBeInTheDocument();
  });

  it("sizes each bar fill proportionally to count/total", () => {
    renderTable();
    expect(screen.getByTestId("metric-bar-securely-patched")).toHaveStyle({
      width: `${(securelyPatched.count / securelyPatched.total) * 100}%`,
    });
    expect(screen.getByTestId("metric-bar-contacted")).toHaveStyle({
      width: "0%",
    });
  });

  it("applies the metric color class to each fill", () => {
    renderTable();
    expect(
      screen.getByTestId("metric-bar-securely-patched").getAttribute("class"),
    ).toMatch(/positive/);
    expect(
      screen.getByTestId("metric-bar-contacted").getAttribute("class"),
    ).toMatch(/neutral/);
  });

  it("links the count to the deep link and runs the activate handler", async () => {
    const user = userEvent.setup();
    renderTable();
    const link = screen.getByRole("link", { name: "View securely patched" });
    expect(link).toHaveAttribute("href", "/instances?query=id%3A1");
    await user.click(link);
    expect(securelyPatched.onCountActivate).toHaveBeenCalledTimes(1);
  });
});
