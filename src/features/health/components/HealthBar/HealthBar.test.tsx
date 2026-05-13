import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ComputerHealth } from "../../types";
import HealthBar from "./HealthBar";

const baseHealth: ComputerHealth = {
  computer_id: 1,
  account_id: 1,
  score: 100,
  band: "healthy",
  critical_factor_count: 0,
  factors: [],
  updated_at: "2026-05-12T12:00:00Z",
};

describe("HealthBar", () => {
  it("renders the score and a healthy aria label when score is 100", () => {
    renderWithProviders(<HealthBar health={baseHealth} />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "100");
    expect(meter.getAttribute("aria-label")).toMatch(/Healthy/);
    expect(meter.getAttribute("aria-label")).toMatch(/100 out of 100/);
  });

  it("classifies critical scores with the critical band label", () => {
    renderWithProviders(
      <HealthBar
        health={{
          ...baseHealth,
          score: 0,
          band: "critical",
          critical_factor_count: 1,
          factors: [
            {
              rule_id: 1,
              rule_key: "usn.critical",
              description: "Pending USN with Ubuntu Priority critical.",
              points: 100,
            },
          ],
        }}
      />,
    );
    const meter = screen.getByRole("meter");
    expect(meter.getAttribute("aria-label")).toMatch(/Critical/);
    expect(meter.getAttribute("aria-label")).toMatch(/1 factor/);
  });

  it("shows the ×N chip only when more than one critical factor", () => {
    const { rerender } = renderWithProviders(
      <HealthBar
        health={{
          ...baseHealth,
          score: 0,
          band: "critical",
          critical_factor_count: 1,
        }}
      />,
    );
    expect(screen.queryByText(/×/)).not.toBeInTheDocument();

    rerender(
      <HealthBar
        health={{
          ...baseHealth,
          score: 0,
          band: "critical",
          critical_factor_count: 3,
        }}
      />,
    );
    expect(screen.getByText("×3")).toBeInTheDocument();
  });

  it("renders the not-measurable variant with an em-dash and explainer text", () => {
    renderWithProviders(<HealthBar notMeasurable />);
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
    expect(
      screen.getByLabelText(/Health not measurable for this instance/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Not measured/)).toBeInTheDocument();
  });

  it("renders the loading state with aria-busy and no meter role", () => {
    renderWithProviders(<HealthBar health={undefined} isLoading />);
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Loading health score")).toBeInTheDocument();
  });

  it("renders the error state when isError is true", () => {
    renderWithProviders(<HealthBar health={undefined} isError />);
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
    expect(
      screen.getByLabelText("Health score unavailable"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Unavailable/)).toBeInTheDocument();
  });

  it("clamps a degenerate >100 score so the bar never overflows", () => {
    renderWithProviders(
      <HealthBar
        health={{
          ...baseHealth,
          score: 175,
        }}
      />,
    );
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "175");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
  });

  it("supports a compact variant that omits the band label", () => {
    renderWithProviders(
      <HealthBar
        compact
        health={{
          ...baseHealth,
          score: 72,
          band: "warning",
        }}
      />,
    );
    // The descriptive band label disappears in compact mode but the meter
    // still exposes the band via aria-label for screen readers.
    expect(screen.queryByText(/^Warning$/)).not.toBeInTheDocument();
    expect(
      screen.getByRole("meter").getAttribute("aria-label"),
    ).toMatch(/Warning/);
  });
});
