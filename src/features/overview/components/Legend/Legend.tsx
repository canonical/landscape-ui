import type { Chart, ChartData, LegendItem } from "chart.js";
import classNames from "classnames";
import type { FC } from "react";
import { Link } from "react-router";
import { handleChartMouseLeave, handleChartMouseOver } from "../../helpers";
import classes from "./Legend.module.scss";
import { STATUSES } from "@/features/instances";
import { useTheme } from "@/context/theme";
import { ROUTES } from "@/libs/routes";

interface LegendProps {
  readonly data: ChartData<"pie">;
  readonly chartInstance: Chart | null;
  readonly selectedArc: number | null;
  readonly setSelectedArc: (index: number | null) => void;
}

const Legend: FC<LegendProps> = ({
  data,
  chartInstance,
  selectedArc,
  setSelectedArc,
}) => {
  const { isDarkMode } = useTheme();

  const numberOfInstances =
    data?.datasets?.map((dataset) => {
      return dataset.data[0] as number;
    }) ?? [];

  return (
    chartInstance && (
      <div
        className={classes.container}
        onMouseLeave={() => {
          handleChartMouseLeave(chartInstance, setSelectedArc, isDarkMode);
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
                    selectedArc === index || selectedArc === null ? 1 : 0.3, // eslint-disable-line @typescript-eslint/no-magic-numbers
                }}
                onMouseEnter={() => {
                  handleChartMouseOver(
                    chartInstance,
                    index,
                    setSelectedArc,
                    isDarkMode,
                  );
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
                  to={ROUTES.instances.root({ status: statusItem.filterValue })}
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
