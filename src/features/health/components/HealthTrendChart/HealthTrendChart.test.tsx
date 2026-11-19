import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HealthTrendChart from "./HealthTrendChart";

const POINTS = [
  { date: "2026-09-01", value: 70 },
  { date: "2026-09-02", value: 72 },
  { date: "2026-09-04", value: null },
  { date: "2026-09-05", value: 80 },
];

const renderChart = (variant: "line" | "step" = "line") =>
  render(
    <HealthTrendChart
      points={POINTS}
      from="2026-09-01"
      to="2026-09-10"
      variant={variant}
      markers={[{ date: "2026-09-05", label: "Rules changed" }]}
      valueLabel="Average score"
    />,
  );

describe("HealthTrendChart", () => {
  it("names the series and its window", () => {
    renderChart();
    expect(
      screen.getByRole("group", {
        name: /Average score from Sep 1, 2026 to Sep 10, 2026/,
      }),
    ).toBeInTheDocument();
  });

  it("offers every point as a table row", () => {
    renderChart();
    const table = screen.getByRole("table", { name: "Average score by day" });
    const rows = within(table).getAllByRole("row");
    expect(rows).toHaveLength(POINTS.length + 1);
    expect(
      within(table).getByRole("row", { name: "Sep 1, 2026 70" }),
    ).toBeInTheDocument();
    expect(
      within(table).getByRole("row", { name: "Sep 4, 2026 Not measured" }),
    ).toBeInTheDocument();
  });

  it("labels the days on which the measurement changed", () => {
    renderChart();
    expect(screen.getByText("Rules changed")).toBeInTheDocument();
  });

  it("reads out a point on focus and steps with the arrow keys", () => {
    renderChart();
    const chart = screen.getByRole("group");
    fireEvent.focus(chart);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Sep 5, 2026Average score: 80Rules changed",
    );

    fireEvent.keyDown(chart, { key: "ArrowLeft" });
    expect(screen.getByRole("status")).toHaveTextContent(
      "Sep 4, 2026Average score: not measured",
    );

    fireEvent.keyDown(chart, { key: "Home" });
    expect(screen.getByRole("status")).toHaveTextContent(
      "Sep 1, 2026Average score: 70",
    );

    fireEvent.blur(chart);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("breaks a daily line at a missing day", () => {
    const { container } = renderChart();
    const path = container.querySelector("path")?.getAttribute("d") ?? "";
    // Sep 1 and 2 join. Sep 5 has no neighbour and starts its own segment.
    expect(path.match(/M/g)).toHaveLength(2);
    expect(path.match(/L/g)).toHaveLength(1);
  });

  it("holds each value until the next point on a step line", () => {
    const { container } = renderChart("step");
    const path = container.querySelector("path")?.getAttribute("d") ?? "";
    // One horizontal run per measured point, and one riser between the two
    // that follow each other.
    expect(path.match(/H/g)).toHaveLength(3);
    expect(path.match(/V/g)).toHaveLength(1);
  });

  it("renders nothing to trace when there are no points", () => {
    const { container } = render(
      <HealthTrendChart
        points={[]}
        from="2026-09-01"
        to="2026-09-10"
        valueLabel="Score"
      />,
    );
    expect(container.querySelector("path")).not.toBeInTheDocument();
  });
});
