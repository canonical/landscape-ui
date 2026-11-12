import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HealthBar from "./HealthBar";

describe("HealthBar", () => {
  it("renders the score with a labelled meter", () => {
    render(<HealthBar health={{ score: 100, band: "healthy" }} />);

    expect(screen.getByText("100")).toBeInTheDocument();
    const meter = screen.getByRole("meter", {
      name: "Health score 100 out of 100, Healthy",
    });
    expect(meter).toHaveAttribute("aria-valuenow", "100");
  });

  it("names the band of a critical score", () => {
    render(<HealthBar health={{ score: 12, band: "critical" }} />);

    expect(
      screen.getByRole("meter", { name: /12 out of 100, Critical/ }),
    ).toHaveClass("error");
  });

  it("clamps a score above the maximum", () => {
    render(<HealthBar health={{ score: 175, band: "healthy" }} />);

    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "100");
  });

  it("says when health is not measured", () => {
    render(<HealthBar notMeasurable />);

    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
    expect(screen.getByText("Not measured")).toBeInTheDocument();
  });

  it("shows a loading state while the score is pending", () => {
    render(<HealthBar isLoading />);

    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/Loading/i);
  });

  it("says when the score is unavailable", () => {
    render(<HealthBar isError />);

    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
    expect(screen.getByText("Unavailable")).toBeInTheDocument();
  });
});
