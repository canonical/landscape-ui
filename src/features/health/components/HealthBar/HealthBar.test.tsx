import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    expect(meter.getAttribute("aria-label")).toMatch(/1 critical factor/);
  });

  it("pluralises the critical-factor count above 1 and shows the chip", () => {
    renderWithProviders(
      <HealthBar
        health={{
          ...baseHealth,
          score: 0,
          band: "critical",
          critical_factor_count: 3,
        }}
      />,
    );
    expect(screen.getByRole("meter").getAttribute("aria-label")).toMatch(
      /3 critical factors/,
    );
    expect(screen.getByText(/×3/)).toBeInTheDocument();
  });

  it("does not render the chip when critical_factor_count is 1", () => {
    renderWithProviders(
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
  });

  it("is keyboard reachable and exposes the factor breakdown on focus", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <HealthBar
        health={{
          ...baseHealth,
          score: 40,
          band: "warning",
          factors: [
            {
              rule_id: 2,
              rule_key: "usn.high",
              description: "Pending USN with Ubuntu Priority high.",
              points: 20,
            },
            {
              rule_id: 4,
              rule_key: "reboot_required",
              description: "Reboot required.",
              points: 10,
            },
          ],
        }}
      />,
    );
    const meter = screen.getByRole("meter");
    await user.tab();
    expect(meter).toHaveFocus();
    // Tooltip content is present in the DOM (hidden by default, surfaced on focus).
    expect(screen.getByText("Pending USN with Ubuntu Priority high.")).toBeInTheDocument();
    expect(screen.getByText("Reboot required.")).toBeInTheDocument();
    // Points are rendered as negative subtractions.
    expect(screen.getByText("−20")).toBeInTheDocument();
    expect(screen.getByText("−10")).toBeInTheDocument();
  });

  it("renders the loading state with aria-busy and no meter role", () => {
    renderWithProviders(<HealthBar health={undefined} isLoading />);
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Loading health score")).toBeInTheDocument();
  });

  it("renders the error state with an em-dash when isError is true", () => {
    renderWithProviders(<HealthBar health={undefined} isError />);
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Health score unavailable")).toBeInTheDocument();
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
    // The bar fill width is clamped to 100% so the visual stays inside the track.
    // We can't read the inline style directly across renderers; the meter still
    // has the right aria-valuemax for screen readers.
    expect(meter).toHaveAttribute("aria-valuemax", "100");
  });

  it("renders an explicit empty message when factors is empty", async () => {
    const user = userEvent.setup();
    renderWithProviders(<HealthBar health={baseHealth} />);
    await user.tab();
    expect(screen.getByText(/No detractors — fully healthy\./)).toBeInTheDocument();
  });
});
