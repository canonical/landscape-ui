import { renderWithProviders } from "@/tests/render";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { colorMap } from "../../constants";
import DonutChart, { type DonutRing } from "./DonutChart";

const baseRings: DonutRing[] = [
  { label: "Up to date", count: 6, colorKey: "green" },
  { label: "Regular", count: 3, colorKey: "orange" },
  { label: "Security", count: 1, colorKey: "red" },
];
const baseTotal = 9;

const renderChart = (overrides?: { total?: number; rings?: DonutRing[] }) =>
  renderWithProviders(
    <DonutChart
      title="Upgrades"
      total={overrides?.total ?? baseTotal}
      rings={overrides?.rings ?? baseRings}
    />,
  );

const getArcs = (container: HTMLElement) =>
  Array.from(
    container.querySelectorAll<SVGPathElement>("[data-testid^='donut-arc-']"),
  );

const getRingGroup = (index: number) => {
  const ring = baseRings[index];
  if (!ring) {
    throw new Error(`No ring at index ${index}`);
  }
  return screen.getByLabelText(new RegExp(`^${ring.label}:`));
};

describe("DonutChart", () => {
  afterEach(() => {
    localStorage.removeItem("_landscape_dark_theme");
  });

  it("renders the title", () => {
    const { container } = renderChart();
    expect(container.querySelector("p")?.textContent).toBe("Upgrades");
  });

  it("renders an aria-labelled svg with the total in the description", () => {
    const { container } = renderChart();
    const svg = container.querySelector("svg[role='img']");
    expect(svg).not.toBeNull();
    expect(svg?.querySelector("title")?.textContent).toBe("Upgrades");
    expect(svg?.querySelector("desc")?.textContent).toMatch(
      /9 instances total/,
    );
  });

  it("renders three rings with per-ring aria-labels", () => {
    renderChart();

    expect(
      screen.getByLabelText("Up to date: 6 of 9 instances (67%)"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Regular: 3 of 9 instances (33%)"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Security: 1 of 9 instances (11%)"),
    ).toBeInTheDocument();
  });

  it("draws each arc starting at the top of its ring with the correct radius and large-arc flag", () => {
    const { container } = renderChart();
    const arcs = getArcs(container);

    // 6/9 = 66.67% > 50%, so largeArc=1; outer ring r=42, starts at (50, 8)
    expect(arcs[0]?.getAttribute("d")).toMatch(
      /^M 50 8 A 42 42 0 1 1 [-\d.]+ [-\d.]+$/,
    );
    // 3/9 = 33.33% <= 50%, so largeArc=0; middle ring r=32, starts at (50, 18)
    expect(arcs[1]?.getAttribute("d")).toMatch(
      /^M 50 18 A 32 32 0 0 1 [-\d.]+ [-\d.]+$/,
    );
    // 1/9 = 11.11% <= 50%, so largeArc=0; inner ring r=22, starts at (50, 28)
    expect(arcs[2]?.getAttribute("d")).toMatch(
      /^M 50 28 A 22 22 0 0 1 [-\d.]+ [-\d.]+$/,
    );
  });

  it("renders no colored arc when count is zero", () => {
    const { container } = renderChart({
      rings: [
        { label: "Up to date", count: 0, colorKey: "green" },
        { label: "Regular", count: 0, colorKey: "orange" },
        { label: "Security", count: 0, colorKey: "red" },
      ],
    });
    expect(getArcs(container)).toHaveLength(0);
  });

  it("renders a full circle as two arcs when count equals total", () => {
    const { container } = renderChart({
      total: 4,
      rings: [
        { label: "Up to date", count: 4, colorKey: "green" },
        { label: "Regular", count: 4, colorKey: "orange" },
        { label: "Security", count: 4, colorKey: "red" },
      ],
    });
    const arcs = getArcs(container);
    expect(arcs[0]).toHaveAttribute(
      "d",
      "M 50 8 A 42 42 0 1 1 50 92 A 42 42 0 1 1 50 8",
    );
    expect(arcs[1]).toHaveAttribute(
      "d",
      "M 50 18 A 32 32 0 1 1 50 82 A 32 32 0 1 1 50 18",
    );
    expect(arcs[2]).toHaveAttribute(
      "d",
      "M 50 28 A 22 22 0 1 1 50 72 A 22 22 0 1 1 50 28",
    );
  });

  it("renders no colored arc when total is zero", () => {
    const { container } = renderChart({
      total: 0,
      rings: [
        { label: "Up to date", count: 0, colorKey: "green" },
        { label: "Regular", count: 0, colorKey: "orange" },
        { label: "Security", count: 0, colorKey: "red" },
      ],
    });
    expect(getArcs(container)).toHaveLength(0);
  });

  it("uses light-mode default colors by default", () => {
    const { container } = renderChart();
    const arcs = getArcs(container);
    expect(arcs[0]).toHaveAttribute(
      "stroke",
      colorMap.green.light.default,
    );
    expect(arcs[1]).toHaveAttribute(
      "stroke",
      colorMap.orange.light.default,
    );
    expect(arcs[2]).toHaveAttribute("stroke", colorMap.red.light.default);
  });

  it("uses dark-mode default colors when dark mode is active", () => {
    localStorage.setItem("_landscape_dark_theme", "true");
    const { container } = renderChart();
    const arcs = getArcs(container);
    expect(arcs[0]).toHaveAttribute(
      "stroke",
      colorMap.green.dark.default,
    );
    expect(arcs[2]).toHaveAttribute(
      "stroke",
      colorMap.red.dark.default,
    );
  });

  it("keeps default colors on every ring when one is hovered (dim via CSS opacity, not palette swap)", async () => {
    const { container } = renderChart();
    const user = userEvent.setup();

    await user.hover(getRingGroup(0));

    const arcs = getArcs(container);
    expect(arcs[0]).toHaveAttribute(
      "stroke",
      colorMap.green.light.default,
    );
    expect(arcs[1]).toHaveAttribute(
      "stroke",
      colorMap.orange.light.default,
    );
    expect(arcs[2]).toHaveAttribute("stroke", colorMap.red.light.default);
  });

  it("flags the hovered ring active and others inactive via CSS classes", async () => {
    renderChart();
    const user = userEvent.setup();

    await user.hover(getRingGroup(0));

    expect(getRingGroup(0).getAttribute("class") ?? "").toMatch(
      /ring--active/,
    );
    expect(getRingGroup(0).getAttribute("class") ?? "").not.toMatch(
      /ring--inactive/,
    );
    expect(getRingGroup(1).getAttribute("class") ?? "").toMatch(
      /ring--inactive/,
    );
    expect(getRingGroup(2).getAttribute("class") ?? "").toMatch(
      /ring--inactive/,
    );
  });

  it("flags rings when a legend row is hovered", async () => {
    renderChart();
    const user = userEvent.setup();

    await user.hover(screen.getByText("Security"));

    expect(getRingGroup(0).getAttribute("class") ?? "").toMatch(
      /ring--inactive/,
    );
    expect(getRingGroup(1).getAttribute("class") ?? "").toMatch(
      /ring--inactive/,
    );
    expect(getRingGroup(2).getAttribute("class") ?? "").toMatch(
      /ring--active/,
    );
  });

  it("resets state when the inner container loses pointer", async () => {
    const { container } = renderChart();
    const user = userEvent.setup();

    await user.hover(getRingGroup(0));
    expect(getRingGroup(0).getAttribute("class") ?? "").toMatch(/ring--active/);

    const inner = container.querySelector(
      "div[class*='innerContainer']",
    ) as HTMLElement;
    fireEvent.mouseLeave(inner);

    expect(getRingGroup(0).getAttribute("class") ?? "").not.toMatch(/ring--active/);
  });

  it("activates a ring on keyboard focus and clears on blur", () => {
    renderChart();

    const ring = getRingGroup(2);
    fireEvent.focus(ring);
    expect(ring.getAttribute("class") ?? "").toMatch(/ring--active/);

    fireEvent.blur(ring);
    expect(ring.getAttribute("class") ?? "").not.toMatch(/ring--active/);
  });

  it("makes each ring keyboard-focusable", () => {
    renderChart();
    [0, 1, 2].forEach((index) => {
      expect(getRingGroup(index)).toHaveAttribute("tabindex", "0");
    });
  });

  it("renders the total in the center label when no ring is selected", () => {
    renderChart();
    expect(screen.getByTestId("donut-center-number").textContent).toBe("9");
    expect(screen.getByTestId("donut-center-sublabel").textContent).toBe(
      "instances",
    );
  });

  it("renders the hovered ring count + total in the center label", async () => {
    const user = userEvent.setup();
    renderChart();

    await user.hover(getRingGroup(1));

    expect(screen.getByTestId("donut-center-number").textContent).toBe("3");
    expect(screen.getByTestId("donut-center-sublabel").textContent).toBe(
      "of 9",
    );
  });

  it("hides the center label content from assistive tech (legend is the SR source)", () => {
    renderChart();
    expect(screen.getByTestId("donut-center-number")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.getByTestId("donut-center-sublabel")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("formats large totals with compact notation in the center label", () => {
    renderChart({
      total: 12_345,
      rings: [
        { label: "Up to date", count: 9_876, colorKey: "green" },
        { label: "Regular", count: 1_500, colorKey: "orange" },
        { label: "Security", count: 969, colorKey: "red" },
      ],
    });

    expect(screen.getByTestId("donut-center-number").textContent).toBe(
      "12.3K",
    );
  });

  it("formats compactly when a large ring is hovered", async () => {
    const user = userEvent.setup();
    renderChart({
      total: 100_000,
      rings: [
        { label: "Up to date", count: 87_400, colorKey: "green" },
        { label: "Regular", count: 8_600, colorKey: "orange" },
        { label: "Security", count: 4_000, colorKey: "red" },
      ],
    });

    await user.hover(getRingGroup(0));

    expect(screen.getByTestId("donut-center-number").textContent).toBe(
      "87.4K",
    );
    expect(screen.getByTestId("donut-center-sublabel").textContent).toBe(
      "of 100K",
    );
  });

  it("renders a track circle behind each ring with the track class", () => {
    const { container } = renderChart();
    const tracks = container.querySelectorAll(
      `circle[class*='track']`,
    );
    expect(tracks).toHaveLength(3);
  });
});
