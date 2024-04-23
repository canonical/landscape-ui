import { renderWithProviders } from "@/tests/render";
import { Chart, registerables } from "chart.js";
import { describe, vi } from "vitest";
import PieChart from "./PieChart";
Chart.register(...registerables);

const props = {
  data: {
    labels: ["Up to date", "Regular", "Security"],
    datasets: [
      {
        backgroundColor: ["#335280", "#fbfbfb"],
        data: [6, 7],
        borderWidth: 3,
        borderColor: "#fbfbfb",
        hoverBorderColor: "#fbfbfb",
      },
      {
        backgroundColor: ["#f99b11", "#fbfbfb"],
        data: [7, 6],
        borderWidth: 3,
        borderColor: "#fbfbfb",
        hoverBorderColor: "#fbfbfb",
      },
      {
        backgroundColor: ["#da0b0b", "#fbfbfb"],
        data: [0, 13],
        borderWidth: 3,
        borderColor: "#fbfbfb",
        hoverBorderColor: "#fbfbfb",
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
