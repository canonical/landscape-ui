import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HealthScore from "./HealthScore";

describe("HealthScore", () => {
  it("shows the score and exposes it through a labelled meter", () => {
    render(<HealthScore score={43} band="warning" />);

    expect(screen.getByText("43")).toBeInTheDocument();
    const meter = screen.getByRole("meter", {
      name: "Health score 43 out of 100, Needs attention",
    });
    expect(meter).toHaveAttribute("aria-valuenow", "43");
    expect(meter).toHaveClass("warning");
  });
});
