import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { FleetHealthSummary } from "../../types";
import FleetHealthWidget from "./FleetHealthWidget";

const AVERAGE_SCORE = 84;

const make = (
  bands: Partial<FleetHealthSummary["bands"]> = {},
  overrides: Partial<FleetHealthSummary> = {},
): FleetHealthSummary => {
  const all = { critical: 0, warning: 0, healthy: 0, unmeasured: 0, ...bands };
  const measured = all.critical + all.warning + all.healthy;
  return {
    bands: all,
    measured_count: measured,
    total_count: measured + all.unmeasured,
    average_score: measured ? AVERAGE_SCORE : null,
    thresholds: { critical_max: 25, warning_max: 60 },
    rules_version: 7,
    top_issues: [],
    updated_at: "2026-05-12T12:00:00Z",
    worker_last_tick_at: "2026-05-12T12:00:30Z",
    recompute_in_progress: false,
    ...overrides,
  };
};

describe("FleetHealthWidget", () => {
  it("renders the empty state when no instances are registered", () => {
    renderWithProviders(<FleetHealthWidget summary={make()} />);
    expect(screen.getByText(/No instances yet/i)).toBeInTheDocument();
  });

  it("renders the meter with the server-provided average score", () => {
    renderWithProviders(
      <FleetHealthWidget
        summary={make({ critical: 2, warning: 8, healthy: 90 })}
      />,
    );
    const meter = screen.getByRole("meter", {
      name: /score 84 of 100, Healthy/i,
    });
    expect(meter).toHaveAttribute("aria-valuenow", "84");
  });

  it("names the average's band from the thresholds in the response", () => {
    renderWithProviders(
      <FleetHealthWidget
        summary={make(
          { healthy: 10 },
          { thresholds: { critical_max: 25, warning_max: 90 } },
        )}
      />,
    );
    expect(
      screen.getByRole("meter", { name: /score 84 of 100, Needs attention/i }),
    ).toBeInTheDocument();
  });

  it("renders a clickable row per band with its count and percentage", () => {
    renderWithProviders(
      <FleetHealthWidget
        summary={make({ critical: 2, warning: 8, healthy: 90 })}
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

  it("surfaces coverage and links the unmeasured row to the list", () => {
    renderWithProviders(
      <FleetHealthWidget summary={make({ healthy: 12, unmeasured: 2 })} />,
    );
    expect(
      screen.getByText(/12 of 14 instances measured/i),
    ).toBeInTheDocument();
    const unmeasured = screen.getByRole("link", {
      name: /Unmeasured: 2 instances, 14 percent of the fleet/i,
    });
    expect(unmeasured.getAttribute("href")).toContain("healthBand=unmeasured");
  });

  it("says the counts are partial while scores are being computed", () => {
    renderWithProviders(
      <FleetHealthWidget
        summary={make({ unmeasured: 5 }, { recompute_in_progress: true })}
      />,
    );
    expect(screen.queryByRole("meter", { name: /score/i })).toBeNull();
    expect(screen.getByText(/No instance has a score yet/i)).toBeVisible();
    expect(screen.getByText(/Scores are being computed/i)).toBeVisible();
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
