import { renderWithProviders } from "@/tests/render";
import { act, screen } from "@testing-library/react";
import { Chart, registerables } from "chart.js";
import type { ActiveElement, ChartEvent } from "chart.js";
import { describe, vi } from "vitest";
import PieChart from "./PieChart";
import { colorMap } from "../../constants";

Chart.register(...registerables);

const GREEN = colorMap.green.light.default;
const ORANGE = colorMap.orange.light.default;
const RED = colorMap.red.light.default;
const lightBackground = colorMap.background.light.default;

// Stable mock chart instance shared across renders to avoid infinite update loop
const MOCK_CHART = {
  legend: { legendItems: [], generateLabels: () => [] },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  update: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDatasetVisibility: () => {},
  data: {
    labels: ["Up to date", "Regular", "Security"],
    datasets: [] as { data: number[]; backgroundColor: string[] }[],
  },
};

// When false, the mock Pie does NOT set ref.current (tests the `if (chartRef.current)` false branch)
let mockSetsRef = true;

let capturedOnHover:
  | ((event: ChartEvent, elements: ActiveElement[], chart: Chart) => void)
  | undefined;

vi.mock("react-chartjs-2", async () => {
  const { forwardRef } = await import("react");
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Pie: forwardRef((props: any, ref: any) => {
      capturedOnHover = props.options?.onHover;
      // Keep data in sync with props each render

      MOCK_CHART.data = {
        labels: props.data?.labels ?? [],
        datasets:
          props.data?.datasets?.map(
            (d: { data: number[]; backgroundColor: string[] }) => ({
              ...d,
              data: [...d.data],
              backgroundColor: [...(d.backgroundColor as string[])],
            }),
          ) ?? [],
      };
      // Set stable ref so PieChart's useEffect can run with a non-null chartInstance
      if (mockSetsRef && ref && typeof ref === "object" && ref !== null) {
        ref.current = MOCK_CHART;
      }
      return <canvas data-testid="pie-chart" />;
    }),
  };
});

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
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        data: [0, 13],
        borderWidth: 3,
        borderColor: lightBackground,
        hoverBorderColor: lightBackground,
      },
    ],
  },
};

describe("PieChart", () => {
  beforeEach(() => {
    capturedOnHover = undefined;
    mockSetsRef = true;
  });

  it("renders PieChart", async () => {
    renderWithProviders(<PieChart {...props} />);
  });

  it("renders the Upgrades title", () => {
    renderWithProviders(<PieChart {...props} />);
    expect(screen.getByText("Upgrades")).toBeInTheDocument();
  });

  it("renders the pie chart canvas", () => {
    renderWithProviders(<PieChart {...props} />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("renders a wrapper div for the legend component", () => {
    const { container } = renderWithProviders(<PieChart {...props} />);
    // Legend container is rendered (even with null chartInstance initially)
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("renders in dark mode context", () => {
    localStorage.setItem("_landscape_dark_theme", "true");
    renderWithProviders(<PieChart {...props} />);
    expect(screen.getByText("Upgrades")).toBeInTheDocument();
    localStorage.removeItem("_landscape_dark_theme");
  });

  it("handles onHover with chart elements (mouse over)", async () => {
    renderWithProviders(<PieChart {...props} />);
    const mockChart = {
      update: vi.fn(),
      setDatasetVisibility: vi.fn(),
      data: {
        labels: props.data.labels,
        datasets: props.data.datasets.map((d) => ({
          ...d,
          data: [...(d.data as number[])],
          backgroundColor: [...(d.backgroundColor as string[])],
        })),
      },
    };
    await act(async () => {
      capturedOnHover?.(
        {} as unknown as ChartEvent,
        [{ datasetIndex: 0 } as ActiveElement],
        mockChart as unknown as Chart,
      );
    });
    expect(mockChart.update).toHaveBeenCalled();
  });

  it("handles onHover without elements (mouse leave)", async () => {
    renderWithProviders(<PieChart {...props} />);
    const mockChart = {
      update: vi.fn(),
      setDatasetVisibility: vi.fn(),
      data: {
        labels: props.data.labels,
        datasets: props.data.datasets.map((d) => ({
          ...d,
          data: [...(d.data as number[])],
          backgroundColor: [...(d.backgroundColor as string[])],
        })),
      },
    };
    await act(async () => {
      capturedOnHover?.(
        {} as unknown as ChartEvent,
        [],
        mockChart as unknown as Chart,
      );
    });
    expect(mockChart.update).toHaveBeenCalled();
  });

  it("renders correctly when chartRef is null (false branch in useEffect)", () => {
    mockSetsRef = false;
    renderWithProviders(<PieChart {...props} />);
    // chartInstance stays null; Legend is not rendered
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
