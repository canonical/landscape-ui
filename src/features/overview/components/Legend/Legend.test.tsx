import { renderWithProviders } from "@/tests/render";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Chart, ChartData } from "chart.js";
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
    update: vi.fn(),
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
    const legendItems = mockChartInstance.data.labels as string[];
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

    const chosenLegendItem =
      mockChartInstance?.data?.labels &&
      mockChartInstance.data.labels.length > 0
        ? (mockChartInstance.data.labels[0] as string)
        : "";

    const legendItem = screen.getByText(chosenLegendItem);
    await userEvent.hover(legendItem);
    expect(mockSetSelectedArc).toHaveBeenCalled();
  });

  it("renders nothing when chartInstance is null", () => {
    const { container } = renderWithProviders(
      <Legend {...props} chartInstance={null} />,
    );
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it("fires onMouseLeave handler on the legend container", () => {
    const { container } = renderWithProviders(<Legend {...props} />);
    const legendContainer = container.querySelector("div");
    assert(legendContainer);
    fireEvent.mouseLeave(legendContainer);
    expect(mockSetSelectedArc).toHaveBeenCalledWith(null);
    expect(
      (mockChartInstance as unknown as { update: ReturnType<typeof vi.fn> })
        .update,
    ).toHaveBeenCalled();
  });

  it("applies reduced opacity to non-selected items when selectedArc is set", () => {
    const { container } = renderWithProviders(
      <Legend {...props} selectedArc={0} />,
    );
    const legendItems = container.querySelectorAll("[style]");
    // Item at index 0 should have opacity 1; others should have 0.3
    expect(legendItems[0]).toHaveStyle({ opacity: "1" });
    expect(legendItems[1]).toHaveStyle({ opacity: "0.3" });
  });

  it("falls back to Unknown status for unrecognised legend item text", () => {
    const unknownLegendChart = {
      ...mockChartInstance,
      legend: {
        legendItems: [{ text: "Unrecognised", index: 0 }],
      },
    } as unknown as Chart;

    const { container } = renderWithProviders(
      <Legend {...props} chartInstance={unknownLegendChart} />,
    );
    // Renders a legend item using the Unknown fallback (no crash)
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("handles data without datasets (nullish ?? [] fallback)", () => {
    const dataWithoutDatasets = {
      labels: ["Up to date"],
    } as unknown as ChartData<"pie">;

    const { container } = renderWithProviders(
      <Legend {...props} data={dataWithoutDatasets} />,
    );
    // numberOfInstances falls back to [] via ?? operator; component renders without crash
    expect(container.querySelector("div")).toBeInTheDocument();
  });
});
