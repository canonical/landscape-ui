import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import HardwareInfoRow from "./HardwareInfoRow";

describe("HardwareInfoRow", () => {
  it("renders label as heading", () => {
    renderWithProviders(
      <HardwareInfoRow label="System">
        <span>content</span>
      </HardwareInfoRow>,
    );

    expect(screen.getByRole("heading", { name: "System" })).toBeInTheDocument();
  });

  it("renders children content", () => {
    renderWithProviders(
      <HardwareInfoRow label="System">
        <span>Hardware details</span>
      </HardwareInfoRow>,
    );

    expect(screen.getByText("Hardware details")).toBeInTheDocument();
  });
});
