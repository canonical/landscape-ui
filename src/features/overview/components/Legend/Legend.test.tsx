import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Chart, ChartData } from "chart.js";
import { vi } from "vitest";
import Legend from "./Legend";

describe("Legend", () => {
  const mockSetSelectedArc = vi.fn();
  const mockData: ChartData<"pie"> = {
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
        data: [5, 8],
        borderWidth: 3,
        borderColor: "#fbfbfb",
        hoverBorderColor: "#fbfbfb",
      },
    ],
  };
  const mockChartInstance = {
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      scales: {},
    },
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
          data: [5, 8],
          borderWidth: 3,
          borderColor: "#fbfbfb",
          hoverBorderColor: "#fbfbfb",
        },
      ],
    },
    legend: {
      legendItems: [
        {
          text: "Up to date",
          fillStyle: "#335280",
          strokeStyle: "#fbfbfb",
          fontColor: "#666",
          lineWidth: 3,
          hidden: false,
          index: 0,
        },
        {
          text: "Regular",
          strokeStyle: "#fbfbfb",
          fontColor: "#666",
          lineWidth: 3,
          hidden: false,
          index: 1,
        },
        {
          text: "Security",
          fillStyle: "#335280",
          strokeStyle: "#fbfbfb",
          fontColor: "#666",
          lineWidth: 3,
          hidden: false,
          index: 2,
        },
      ],
    },
  } as unknown as Chart;

  const props = {
    data: mockData,
    chartInstance: mockChartInstance,
    selectedArc: null,
    setSelectedArc: mockSetSelectedArc,
  };

  it("renders without crashing", () => {
    renderWithProviders(<Legend {...props} />);
  });

  it("renders legend items", () => {
    renderWithProviders(<Legend {...props} />);
    const legendItems = mockChartInstance.data.labels! as string[];
    legendItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("renders links for legend items", () => {
    renderWithProviders(<Legend {...props} />);
    const legendData = mockChartInstance.data.datasets.map(
      (set) => set.data[0] as number,
    );

    for (const singleLegendData of legendData) {
      expect(
        screen.getByRole("link", { name: `${singleLegendData} instances` }),
      ).toBeInTheDocument();
    }
  });

  it("calls setSelectedArc when a legend item is moused over", async () => {
    renderWithProviders(<Legend {...props} />);
    const chosenLegendItem = mockChartInstance.data.labels![0] as string;
    const legendItem = screen.getByText(chosenLegendItem);
    await userEvent.hover(legendItem);
    expect(mockSetSelectedArc).toHaveBeenCalled();
  });
});
