import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import ChartContainer from "./ChartContainer";

vi.mock("../DonutChart", () => ({
  default: () => <div data-testid="donut-chart" />,
}));

describe("ChartContainer", () => {
  it("renders without crashing", () => {
    renderWithProviders(<ChartContainer />);

    expect(document.body).toBeTruthy();
  });

  it("renders a DonutChart element", () => {
    renderWithProviders(<ChartContainer />);

    expect(screen.getByTestId("donut-chart")).toBeInTheDocument();
  });
});
