import type { Chart } from "chart.js";
import type { Color } from "./types";
import { colorMap } from "./constants";

const chartLabelToColorLabel = (label: string): Color => {
  switch (label) {
    case "Security":
      return "red";
    case "Regular":
      return "orange";
    case "Up to date":
      return "green";
    default:
      return "red";
  }
};

export const handleChartMouseOver = (
  chartInstance: Chart,
  index: number,
  setSelectedArc: (idx: number | null) => void,
  isDarkMode: boolean,
) => {
  setSelectedArc(index);
  const clickedDatasetIndex = index;

  chartInstance.data.datasets.forEach((dataset, datasetIndex) => {
    const bg = dataset.data.map<string | undefined>((_, i) => {
      const isMainArc = i === 0;
      const isRemainderArc = i === 1;

      if (isRemainderArc) {
        return undefined;
      }

      const { labels } = chartInstance.data;
      if (!labels) {
        return undefined;
      }

      const colorLabel = chartLabelToColorLabel(labels[datasetIndex] as string);

      if (isMainArc && datasetIndex === clickedDatasetIndex) {
        return colorMap[colorLabel][isDarkMode ? "dark" : "light"].default;
      }

      return colorMap[colorLabel][isDarkMode ? "dark" : "light"].disabled;
    });

    dataset.backgroundColor = bg;
  });
};

export const handleChartMouseLeave = (
  chartInstance: Chart,
  setSelectedArc: (index: number | null) => void,
  isDarkMode: boolean,
) => {
  chartInstance.data.datasets.forEach((dataset, datasetIndex) => {
    const bg = dataset.data.map<string | undefined>((_, i) => {
      const isMainArc = i === 0;

      const { labels } = chartInstance.data;
      if (!labels) {
        return undefined;
      }

      if (isMainArc) {
        const colorLabel = chartLabelToColorLabel(
          labels[datasetIndex] as string,
        );
        return colorMap[colorLabel][isDarkMode ? "dark" : "light"].default;
      }

      return undefined;
    });

    dataset.backgroundColor = bg;
  });

  setSelectedArc(null);
};
