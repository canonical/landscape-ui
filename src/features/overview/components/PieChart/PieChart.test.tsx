import { renderWithProviders } from "@/tests/render";
import { Chart, registerables } from "chart.js";
import { describe, vi } from "vitest";
import PieChart from "./PieChart";
import { colorMap } from "../../constants";
Chart.register(...registerables);

const GREEN = colorMap.green.light.default;
const ORANGE = colorMap.orange.light.default;
const RED = colorMap.red.light.default;
const lightBackground = colorMap.background.light.default;

const props = {
  data: {
    labels: ["Up to date", "Regular", "Security"],
    datasets: [
      {
        backgroundColor: [GREEN, lightBackground],
        data: [6, 7],
        borderWidth: 3,
        borderColor: lightBackground,
        hoverBorderColor: lightBackground,
      },
      {
        backgroundColor: [ORANGE, lightBackground],
        data: [7, 6],
        borderWidth: 3,
        borderColor: lightBackground,
        hoverBorderColor: lightBackground,
      },
      {
        backgroundColor: [RED, lightBackground],
        data: [0, 13],
        borderWidth: 3,
        borderColor: lightBackground,
        hoverBorderColor: lightBackground,
      },
    ],
  },
};

vi.mock("react-chartjs-2", () => ({
  Pie: () => null,
}));

describe("PieChart", () => {
  it("renders PieChart", async () => {
    renderWithProviders(<PieChart {...props} />);
  });
});
