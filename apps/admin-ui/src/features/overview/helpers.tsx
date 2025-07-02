import type { ActiveElement, Chart } from "chart.js";

export interface IColors {
  security: {
    default: string;
    disabled: string;
  };
  regular: {
    default: string;
    disabled: string;
  };
  upToDate: {
    default: string;
    disabled: string;
  };
}

export enum Colors {
  GREEN = "#0e8420",
  DISABLED_GREEN = "#b7dabc",
  ORANGE = "#f99b11",
  DISABLED_ORANGE = "#fad59d",
  RED = "#da0b0b",
  DISABLED_RED = "#ee9b9b",
  WHITE = "#fbfbfb",
}

export const chartLabelToColorLabel = (label: string): keyof IColors => {
  let colorLabel: keyof IColors;
  switch (label) {
    case "Security":
      colorLabel = "security";
      break;
    case "Regular":
      colorLabel = "regular";
      break;
    case "Up to date":
      colorLabel = "upToDate";
      break;
    default:
      colorLabel = "security";
      break;
  }
  return colorLabel;
};

export const labelColors: IColors = {
  upToDate: {
    default: Colors.GREEN,
    disabled: Colors.DISABLED_GREEN,
  },
  regular: {
    default: Colors.ORANGE,
    disabled: Colors.DISABLED_ORANGE,
  },
  security: {
    default: Colors.RED,
    disabled: Colors.DISABLED_RED,
  },
};

export const handleChartMouseOver = (
  chartInstance: Chart,
  index: number,
  setSelectedArc: (index: number | null) => void,
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
          const color = labelColors[colorLabel].default;
          return color;
        }
        if (i === 1) {
          return "#fbfbfb";
        }
        return labelColors[
          chartLabelToColorLabel(
            chartInstance.data.labels[datasetIndex] as string,
          )
        ].disabled;
      }
    });
  });
};

export const handleChartMouseLeave = (
  chartInstance: Chart,
  setSelectedArc: (index: number | null) => void,
) => {
  chartInstance.data.datasets.forEach((dataset, datasetIndex) => {
    dataset.backgroundColor = dataset.data.map((_, i) => {
      if (chartInstance.data.labels) {
        if (i === 0) {
          return labelColors[
            chartLabelToColorLabel(
              chartInstance.data.labels[datasetIndex] as string,
            )
          ].default;
        }
      }
    });
  });
  setSelectedArc(null);
};

export const handleChartHover = (
  chartInstance: Chart,
  elements: ActiveElement[],
  setSelectedArc: (index: number | null) => void,
) => {
  if (elements.length > 0) {
    setSelectedArc(elements[0].datasetIndex);
    const clickedDatasetIndex = elements[0].datasetIndex;
    chartInstance.data.datasets.forEach((dataset, datasetIndex) => {
      dataset.backgroundColor = dataset.data.map((_, i) => {
        if (i === 1) {
          return;
        }
        if (chartInstance.data.labels) {
          if (i === 0 && datasetIndex === clickedDatasetIndex) {
            return labelColors[
              chartLabelToColorLabel(
                chartInstance.data.labels[datasetIndex] as string,
              )
            ].default;
          }
          if (i === 1) {
            return "#fbfbfb";
          }
          return labelColors[
            chartLabelToColorLabel(
              chartInstance.data.labels[datasetIndex] as string,
            )
          ].disabled;
        }
      });
    });
  } else {
    setSelectedArc(null);
    chartInstance.data.datasets.forEach((dataset, datasetIndex) => {
      dataset.backgroundColor = dataset.data.map((_, i) => {
        if (chartInstance.data.labels) {
          if (i === 0) {
            return labelColors[
              chartLabelToColorLabel(
                chartInstance.data.labels[datasetIndex] as string,
              )
            ].default;
          }
        }
      });
    });
  }
};
