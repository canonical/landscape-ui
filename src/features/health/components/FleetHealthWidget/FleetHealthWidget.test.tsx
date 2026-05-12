import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { FleetHealthSummary } from "../../types";
import FleetHealthWidget from "./FleetHealthWidget";

const make = (
  overrides: Partial<FleetHealthSummary> = {},
): FleetHealthSummary => ({
  account_id: 1,
  band_critical_count: 0,
  band_warning_count: 0,
  band_healthy_count: 0,
  total_count: 0,
  updated_at: "2026-05-12T12:00:00Z",
  ...overrides,
});

describe("FleetHealthWidget", () => {
  it("renders the empty state when no instances are registered", () => {
    renderWithProviders(<FleetHealthWidget summary={make()} />);
    expect(screen.getByText(/No instances yet/i)).toBeInTheDocument();
  });

  it("anchors the center on the worst non-empty band (critical wins)", () => {
    renderWithProviders(
      <FleetHealthWidget
        summary={make({
          band_critical_count: 5,
          band_warning_count: 20,
          band_healthy_count: 75,
          total_count: 100,
        })}
      />,
    );
    // The center text shows the band's count and label. With 5 criticals,
    // 5 + "Critical" are anchored in the centre.
    expect(screen.getAllByText("5").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Critical").length).toBeGreaterThan(0);
  });

  it("anchors the center on warning when there are no criticals", () => {
    renderWithProviders(
      <FleetHealthWidget
        summary={make({
          band_warning_count: 15,
          band_healthy_count: 85,
          total_count: 100,
        })}
      />,
    );
    expect(screen.getAllByText("15").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Warning").length).toBeGreaterThan(0);
  });

  it("anchors the center on healthy when the fleet is fully healthy", () => {
    renderWithProviders(
      <FleetHealthWidget
        summary={make({ band_healthy_count: 50, total_count: 50 })}
      />,
    );
    expect(screen.getAllByText("50").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Healthy").length).toBeGreaterThan(0);
  });

  it("renders a band button per band with the right count", () => {
    renderWithProviders(
      <FleetHealthWidget
        summary={make({
          band_critical_count: 2,
          band_warning_count: 8,
          band_healthy_count: 90,
          total_count: 100,
        })}
      />,
    );
    // Legend items + SVG arcs are both buttons. Match on the legend's
    // composed visible text ("Critical 2", etc.).
    const buttons = screen.getAllByRole("button");
    const labels = buttons.map((b) => b.textContent ?? "");
    expect(labels).toContain("Critical2");
    expect(labels).toContain("Warning8");
    expect(labels).toContain("Healthy90");
  });

  it("invokes onBandSelect when a legend item is clicked", async () => {
    const onBandSelect = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <FleetHealthWidget
        summary={make({
          band_critical_count: 1,
          band_warning_count: 0,
          band_healthy_count: 99,
          total_count: 100,
        })}
        onBandSelect={onBandSelect}
      />,
    );
    // Find the legend button (the one whose text starts with "Critical").
    const critical = screen
      .getAllByRole("button")
      .find((b) => b.textContent?.startsWith("Critical"));
    if (!critical) throw new Error("Critical legend button not found");
    await user.click(critical);
    expect(onBandSelect).toHaveBeenCalledWith("critical");
  });

  it("provides an aria-label describing the whole distribution on the SVG", () => {
    renderWithProviders(
      <FleetHealthWidget
        summary={make({
          band_critical_count: 1,
          band_warning_count: 4,
          band_healthy_count: 95,
          total_count: 100,
        })}
      />,
    );
    const svg = screen.getByRole("img");
    expect(svg.getAttribute("aria-label")).toMatch(
      /100 instances: 1 critical, 4 warning, 95 healthy\./i,
    );
  });

  it("shows the loading skeleton when isLoading is true", () => {
    renderWithProviders(<FleetHealthWidget summary={undefined} isLoading />);
    expect(screen.getByLabelText(/Loading fleet health/i)).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("shows the error state when isError is true", () => {
    renderWithProviders(<FleetHealthWidget summary={undefined} isError />);
    expect(screen.getByRole("alert")).toHaveTextContent(/Couldn't load fleet health/);
  });
});
