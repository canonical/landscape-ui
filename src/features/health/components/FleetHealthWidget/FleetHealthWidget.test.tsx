import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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

  it("renders the meter with the server-provided average score", () => {
    renderWithProviders(
      <FleetHealthWidget
        summary={make({
          band_critical_count: 2,
          band_warning_count: 8,
          band_healthy_count: 90,
          total_count: 100,
          average_score: 84,
          measurable_count: 100,
        })}
      />,
    );
    const meter = screen.getByRole("meter", {
      name: /score 84 of 100, Healthy/i,
    });
    expect(meter).toHaveAttribute("aria-valuenow", "84");
  });

  it("renders a clickable row per band with its count and percentage", () => {
    renderWithProviders(
      <FleetHealthWidget
        summary={make({
          band_critical_count: 2,
          band_warning_count: 8,
          band_healthy_count: 90,
          total_count: 100,
          measurable_count: 100,
        })}
      />,
    );
    const critical = screen.getByRole("link", {
      name: /Critical: 2 instances, 2 percent/i,
    });
    expect(critical.getAttribute("href")).toContain("healthBand=critical");
    const warning = screen.getByRole("link", {
      name: /Needs attention: 8 instances, 8 percent/i,
    });
    expect(warning.getAttribute("href")).toContain("healthBand=warning");
  });

  it("surfaces coverage in the footer when some instances aren't measurable", () => {
    renderWithProviders(
      <FleetHealthWidget
        summary={make({
          band_healthy_count: 12,
          total_count: 14,
          measurable_count: 12,
        })}
      />,
    );
    expect(
      screen.getByText(/12 of 14 instances measured/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/2 non-Ubuntu instances can't be measured/i),
    ).toBeInTheDocument();
  });

  it("shows the loading state when isLoading is true", () => {
    renderWithProviders(<FleetHealthWidget summary={undefined} isLoading />);
    expect(screen.getByRole("status")).toHaveTextContent(/Loading/i);
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
  });

  it("shows the error state when isError is true", () => {
    renderWithProviders(<FleetHealthWidget summary={undefined} isError />);
    expect(screen.getByText(/Fleet health unavailable/)).toBeInTheDocument();
    expect(
      screen.getByText(/couldn't load the fleet health summary/i),
    ).toBeInTheDocument();
  });
});
