import { renderWithProviders } from "@/tests/render";
import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { DonutSegment } from "./ReportDonutChart";
import ReportDonutChart from "./ReportDonutChart";

const overSixty: DonutSegment = {
  key: "over-60",
  label: "60+ days",
  count: 5,
  color: "red",
  countHref: "/instances?query=id%3A7",
  onCountActivate: vi.fn(),
  countAriaLabel: "View 60+ days",
};
const segments: DonutSegment[] = [
  overSixty,
  { key: "30-60", label: "30–60 days", count: 0, color: "orange" },
  { key: "within-2", label: "Within 2 days", count: 6, color: "green" },
];

const total = segments.reduce((sum, segment) => sum + segment.count, 0);

const renderChart = () =>
  renderWithProviders(
    <ReportDonutChart
      total={total}
      segments={segments}
      labelHeader="Time to patch USNs"
      countHeader="Instances"
    />,
  );

describe("ReportDonutChart", () => {
  it("renders the total and unit in the centre, hidden from AT", () => {
    renderChart();
    const centre = screen.getByTestId("donut-total");
    expect(centre.textContent).toBe(`${total}`);
    expect(screen.getByTestId("donut-sublabel").textContent).toBe("instances");
    expect(centre).toHaveAttribute("aria-hidden", "true");
  });

  it("shows the hovered segment's count in the centre", () => {
    renderChart();

    fireEvent.mouseEnter(screen.getByTestId("donut-arc-within-2"));
    expect(screen.getByTestId("donut-total").textContent).toBe("6");
    expect(screen.getByTestId("donut-sublabel").textContent).toBe(
      `of ${total}`,
    );

    fireEvent.mouseLeave(screen.getByTestId("donut-arc-within-2"));
    expect(screen.getByTestId("donut-total").textContent).toBe(`${total}`);
    expect(screen.getByTestId("donut-sublabel").textContent).toBe("instances");
  });

  it("renders an aria-labelled svg describing the breakdown", () => {
    const { container } = renderChart();
    const svg = container.querySelector("svg[role='img']");
    expect(svg?.querySelector("desc")?.textContent).toBe(
      "11 instances total: 5 60+ days, 0 30–60 days, 6 within 2 days.",
    );
  });

  it("draws an arc only for non-zero segments, with the segment colour", () => {
    renderChart();
    const arc = screen.getByTestId("donut-arc-over-60");
    expect(arc.getAttribute("class")).toMatch(/red/);
    const pct = (overSixty.count / total) * 100;
    // The visible arc is shortened so a thin gap follows it before the next
    // segment.
    const parts = (arc.getAttribute("stroke-dasharray") ?? "").split(" ");
    expect(Number(parts[0])).toBeLessThan(pct);
    expect(Number(parts[0])).toBeGreaterThan(0);
    expect(screen.queryByTestId("donut-arc-30-60")).not.toBeInTheDocument();
    expect(screen.getByTestId("donut-arc-within-2")).toBeInTheDocument();
  });

  it("renders a legend row per segment with a clickable count", async () => {
    const user = userEvent.setup();
    renderChart();
    const table = within(
      screen.getByText("60+ days").closest("table") as HTMLElement,
    );
    expect(table.getByText("Within 2 days")).toBeInTheDocument();

    const link = table.getByRole("link", { name: "View 60+ days" });
    expect(link).toHaveAttribute("href", "/instances?query=id%3A7");
    await user.click(link);
    expect(overSixty.onCountActivate).toHaveBeenCalledTimes(1);
  });

  it("grows the arc and highlights the matching legend row on arc hover", () => {
    renderChart();
    const arc = screen.getByTestId("donut-arc-within-2");

    fireEvent.mouseEnter(arc);
    expect(arc.getAttribute("class")).toMatch(/arcActive/);
    expect(screen.getByText("Within 2 days").closest("tr")?.className).toMatch(
      /rowActive/,
    );
    expect(screen.getByText("60+ days").closest("tr")?.className).toMatch(
      /rowDimmed/,
    );

    fireEvent.mouseLeave(arc);
    expect(arc.getAttribute("class")).not.toMatch(/arcActive/);
    expect(
      screen.getByText("Within 2 days").closest("tr")?.className,
    ).not.toMatch(/rowActive/);
  });

  it("grows the matching arc when a legend row is hovered", () => {
    renderChart();

    fireEvent.mouseEnter(
      screen.getByText("60+ days").closest("tr") as HTMLElement,
    );
    expect(
      screen.getByTestId("donut-arc-over-60").getAttribute("class"),
    ).toMatch(/arcActive/);
  });
});
