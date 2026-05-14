import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/tests/render";
import DaysFilter from "./DaysFilter";

describe("DaysFilter", () => {
  it("renders a 'Days' filter button", () => {
    renderWithProviders(<DaysFilter />);

    expect(screen.getByRole("button", { name: /days/i })).toBeInTheDocument();
  });
});
