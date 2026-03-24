import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import ChartContainer from "./ChartContainer";

vi.mock("../PieChart", () => ({
  default: () => <div data-testid="pie-chart" />,
}));

describe("ChartContainer", () => {
  it("renders without crashing", () => {
    renderWithProviders(<ChartContainer />);

    expect(document.body).toBeTruthy();
  });

  it("renders a PieChart element", () => {
    renderWithProviders(<ChartContainer />);

    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });
});
