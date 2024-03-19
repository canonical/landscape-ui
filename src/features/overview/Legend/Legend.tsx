import { Chart, ChartData, LegendItem } from "chart.js";
import classNames from "classnames";
import { FC } from "react";
import { Link } from "react-router-dom";
import {
  chartLabelToColorLabel,
  handleChartMouseLeave,
  handleChartMouseOver,
  labelColors,
} from "../helpers";
import classes from "./Legend.module.scss";
import { getNavigationLink } from "./helpers";

interface LegendProps {
  data: ChartData<"pie">;
  chartInstance: Chart | null;
  selectedArc: number | null;
  setSelectedArc: (index: number | null) => void;
}

const Legend: FC<LegendProps> = ({
  data,
  chartInstance,
  selectedArc,
  setSelectedArc,
}) => {
  const numberOfInstances =
    data?.datasets?.map((dataset) => {
      return dataset.data[0] as number;
    }) ?? [];

  return (
    chartInstance && (
      <div
        className={classes.container}
        onMouseLeave={() => {
          handleChartMouseLeave(chartInstance, setSelectedArc);
          chartInstance.update();
        }}
      >
        {chartInstance.legend?.legendItems?.map(
          (item: LegendItem, index: number) => {
            return (
              <div
                key={index}
                className={classNames(
                  "u-no-padding u-no-margin",
                  classes.legendItem,
                )}
                style={{
                  opacity:
                    selectedArc === index || selectedArc === null ? 1 : 0.3,
                }}
                onMouseEnter={() => {
                  handleChartMouseOver(chartInstance, index, setSelectedArc);
                }}
              >
                <div className={classes.legendItem__label}>
                  <div
                    className={classes.legendItem__circle}
                    style={{
                      backgroundColor:
                        labelColors[chartLabelToColorLabel(item.text)].default,
                    }}
                  />
                  <span>{item.text}</span>
                </div>
                <Link
                  to={getNavigationLink(item.text)}
                  className="u-no-margin u-no-padding"
                >
                  {numberOfInstances[index]} instances
                </Link>
              </div>
            );
          },
        )}
      </div>
    )
  );
};

export default Legend;
