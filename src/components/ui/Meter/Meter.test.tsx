import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Meter from "./Meter";

describe("Meter", () => {
  it("exposes the value through the meter role", () => {
    render(<Meter value={43} aria-label="Health score" />);

    const meter = screen.getByRole("meter", { name: "Health score" });
    expect(meter).toHaveAttribute("aria-valuenow", "43");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
    expect(meter.style.getPropertyValue("--meter-fill")).toBe("43%");
  });

  it("clamps values outside the range", () => {
    render(<Meter value={140} aria-label="Health score" />);

    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "100");
    expect(meter.style.getPropertyValue("--meter-fill")).toBe("100%");
  });

  it("scales the fill to a custom range", () => {
    render(<Meter value={5} min={0} max={20} aria-label="Load" />);

    expect(
      screen.getByRole("meter").style.getPropertyValue("--meter-fill"),
    ).toBe("25%");
  });

  it("applies the criticality modifier and a custom class", () => {
    render(
      <Meter
        value={10}
        criticality="error"
        className="custom"
        aria-label="Health score"
      />,
    );

    expect(screen.getByRole("meter")).toHaveClass(
      "ds",
      "meter",
      "error",
      "custom",
    );
  });
});
