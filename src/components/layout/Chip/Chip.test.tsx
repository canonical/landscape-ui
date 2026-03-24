import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Chip from "./Chip";

describe("Chip", () => {
  it("renders the value text", () => {
    renderWithProviders(<Chip value="test-chip" />);
    expect(screen.getByText("test-chip")).toBeInTheDocument();
  });
});
