import type { ActiveElement, ChartData } from "chart.js";
import { Chart, registerables } from "chart.js";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Pie } from "react-chartjs-2";
import Legend from "../Legend";
import { handleChartMouseLeave, handleChartMouseOver } from "../../helpers";
import classes from "./PieChart.module.scss";
import type { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

Chart.register(...registerables);

interface PieChartProps {
  readonly data: ChartData<"pie">;
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const chartRef = useRef<ChartJSOrUndefined<"pie"> | null>(undefined);
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);
  const [selectedArc, setSelectedArc] = useState<number | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      setChartInstance(chartRef.current as Chart);
    }
  }, [chartRef.current]);

  return (
    <div className={classes.outerContainer}>
      <p className={classNames("u-no-padding u-no-margin", classes.title)}>
        Upgrades
      </p>
      <div className={classes.innerContainer}>
        <Legend
          data={data}
          chartInstance={chartInstance}
          selectedArc={selectedArc}
          setSelectedArc={setSelectedArc}
        />
        <div className={classes.chartContainer}>
          <Pie
            ref={chartRef}
            data={data}
            options={{
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
              cutout: "40%",
              onHover: function (_, elements: ActiveElement[], chart: Chart) {
                if (elements.length > 0) {
                  handleChartMouseOver(
                    chart,
                    elements[0].datasetIndex,
                    setSelectedArc,
                  );
                } else {
                  handleChartMouseLeave(chart, setSelectedArc);
                }
                chart.update();
              },
            }}
            className={classes.pieChart}
          />
        </div>
      </div>
    </div>
  );
};

export default PieChart;
