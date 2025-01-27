import { Chart, ChartData, LegendItem } from "chart.js";
import classNames from "classnames";
import { FC } from "react";
import { Link } from "react-router";
import { handleChartMouseLeave, handleChartMouseOver } from "../../helpers";
import classes from "./Legend.module.scss";
import { STATUSES } from "@/features/instances";
import { ROOT_PATH } from "@/constants";

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
            const statusItem =
              Object.values(STATUSES).find(
                (status) => status?.alternateLabel === item.text,
              ) ?? STATUSES["Unknown"];
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
                  <i
                    className={classNames(
                      `p-icon--${statusItem.icon.color}`,
                      classes.legendItem__icon,
                    )}
                  />
                  <span>{item.text}</span>
                </div>
                <Link
                  to={`${ROOT_PATH}instances?status=${statusItem.filterValue}`}
                  className={classNames(
                    "u-no-margin u-no-padding",
                    classes.link,
                  )}
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
