import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HealthScoreSummary from "./HealthScoreSummary";

describe("HealthScoreSummary", () => {
  it("shows the score, its band and a labelled meter", () => {
    render(<HealthScoreSummary score={43} band="warning" hint="Some hint" />);

    expect(screen.getByText("43")).toBeInTheDocument();
    expect(screen.getByText("Needs attention")).toBeInTheDocument();
    expect(screen.getByText("Some hint")).toBeInTheDocument();
    expect(
      screen.getByRole("meter", {
        name: "Health score 43 of 100, Needs attention",
      }),
    ).toHaveAttribute("aria-valuenow", "43");
  });
});
