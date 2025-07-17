import type { ChartData } from "chart.js";

export const getChartData = ({
  chartData,
  totalInstances,
}: {
  chartData: { count: number; title: string; backgroundColors: string[] }[];
  totalInstances: number;
}): ChartData<"pie"> => {
  return {
    labels: chartData.map((data) => data.title),
    datasets: chartData.map((data) => ({
      backgroundColor: [data.backgroundColors[0], data.backgroundColors[1]],
      data: [data.count, totalInstances - data.count],
      borderWidth: 3,
      borderColor: data.backgroundColors[1],
      hoverBorderColor: data.backgroundColors[1],
    })),
  };
};
