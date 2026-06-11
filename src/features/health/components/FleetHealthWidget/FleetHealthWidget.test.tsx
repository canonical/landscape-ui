import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { FleetHealthSummary, FleetTopDetractor } from "../../types";
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

const detractor = (
  overrides: Partial<FleetTopDetractor> = {},
): FleetTopDetractor => ({
  rule_id: 1,
  rule_key: "usn.critical",
  title: "Critical security notice",
  description: "Pending critical USN",
  weight: 100,
  computer_count: 12,
  ...overrides,
});

describe("FleetHealthWidget", () => {
  it("renders the empty state when no instances are registered", () => {
    renderWithProviders(<FleetHealthWidget summary={make()} />);
    expect(screen.getByText(/No instances yet/i)).toBeInTheDocument();
  });

  it("renders the gauge with the server-provided average score", () => {
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
    const svg = screen.getByRole("img");
    expect(svg.getAttribute("aria-label")).toMatch(/score 84 of 100, Healthy/i);
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
      name: /2 critical instances, 2 percent/i,
    });
    expect(critical.getAttribute("href")).toContain("healthBand=critical");
    const warning = screen.getByRole("link", {
      name: /8 warning instances, 8 percent/i,
    });
    expect(warning.getAttribute("href")).toContain("healthBand=warning");
  });

  it("renders top detractors with affected instance counts", () => {
    renderWithProviders(
      <FleetHealthWidget
        summary={make({
          band_critical_count: 2,
          band_warning_count: 8,
          band_healthy_count: 90,
          total_count: 100,
          measurable_count: 100,
        })}
        topDetractors={[
          detractor(),
          detractor({
            rule_id: 5,
            rule_key: "reboot_required",
            description: "Reboot required",
            weight: 10,
            computer_count: 7,
          }),
        ]}
      />,
    );
    const issuesSection = screen.getByText(/Top issues now/i).closest("div");
    if (!issuesSection) throw new Error("issues section missing");
    const within_ = within(issuesSection);
    expect(within_.getByText(/12 instances/)).toBeInTheDocument();
    expect(within_.getByText(/Pending critical USN/)).toBeInTheDocument();
    expect(within_.getByText(/7 instances/)).toBeInTheDocument();
    expect(within_.getByText(/Reboot required/)).toBeInTheDocument();
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

  it("shows the loading skeleton when isLoading is true", () => {
    renderWithProviders(<FleetHealthWidget summary={undefined} isLoading />);
    expect(screen.getByLabelText(/Loading fleet health/i)).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("shows the error state when isError is true", () => {
    renderWithProviders(<FleetHealthWidget summary={undefined} isError />);
    expect(screen.getByText(/Fleet health unavailable/)).toBeInTheDocument();
    expect(
      screen.getByText(/couldn't load the fleet health summary/i),
    ).toBeInTheDocument();
  });
});
