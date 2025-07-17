import type { Chart } from "chart.js";
import type { Color } from "./types";
import { colorMap } from "./constants";

export const chartLabelToColorLabel = (label: string): Color => {
  let colorLabel: Color;
  switch (label) {
    case "Security":
      colorLabel = "red";
      break;
    case "Regular":
      colorLabel = "orange";
      break;
    case "Up to date":
      colorLabel = "green";
      break;
    default:
      colorLabel = "red";
      break;
  }

  return colorLabel;
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
    dataset.backgroundColor = dataset.data.map((_, i) => {
      if (i === 1) {
        return;
      }
      if (chartInstance.data.labels) {
        if (i === 0 && datasetIndex === clickedDatasetIndex) {
          const colorLabel = chartLabelToColorLabel(
            chartInstance.data.labels[datasetIndex] as string,
          );

          return colorMap[colorLabel][isDarkMode ? "dark" : "light"].default;
        }

        if (i === 1) {
          return "#fbfbfb";
        }

        return colorMap[
          chartLabelToColorLabel(
            chartInstance.data.labels[datasetIndex] as string,
          )
        ][isDarkMode ? "dark" : "light"].disabled;
      }
    });
  });
};

export const handleChartMouseLeave = (
  chartInstance: Chart,
  setSelectedArc: (index: number | null) => void,
  isDarkMode: boolean,
) => {
  chartInstance.data.datasets.forEach((dataset, datasetIndex) => {
    dataset.backgroundColor = dataset.data.map((_, i) => {
      if (chartInstance.data.labels) {
        if (i === 0) {
          return colorMap[
            chartLabelToColorLabel(
              chartInstance.data.labels[datasetIndex] as string,
            )
          ][isDarkMode ? "dark" : "light"].default;
        }
      }
    });
  });
  setSelectedArc(null);
};
