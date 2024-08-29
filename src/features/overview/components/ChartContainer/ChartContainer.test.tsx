import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import ChartContainer from "./ChartContainer";
import { vi } from "vitest";

vi.mock("react-chartjs-2", () => ({
  Pie: () => null,
}));

describe("ChartContainer", () => {
  it("renders ChartContainer", async () => {
    renderWithProviders(<ChartContainer />);
  });
});
