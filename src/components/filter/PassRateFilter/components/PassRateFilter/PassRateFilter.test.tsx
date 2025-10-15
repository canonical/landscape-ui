import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PassRateFilter from "./PassRateFilter";

describe("PassRateFilter", () => {
  it("renders a badge when a filter is applied", () => {
    renderWithProviders(<PassRateFilter />, undefined, "/?passRateFrom=50");

    expect(screen.getByText("Pass rate")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
