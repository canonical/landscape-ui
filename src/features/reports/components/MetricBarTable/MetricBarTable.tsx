import classNames from "classnames";
import type { FC } from "react";
import type { ReportLegendRow } from "../ReportLegendTable";
import ReportLegendTable from "../ReportLegendTable";
import classes from "./MetricBarTable.module.scss";

export type MetricColor = "positive" | "link" | "neutral";

export interface MetricRow {
  readonly key: string;
  readonly label: string;
  readonly count: number;
  readonly total: number;
  readonly color: MetricColor;
  readonly countHref?: string;
  readonly onCountActivate?: () => void;
  readonly countAriaLabel?: string;
}

interface MetricBarTableProps {
  readonly labelHeader: string;
  readonly countHeader: string;
  readonly rows: readonly MetricRow[];
}

const MetricBarTable: FC<MetricBarTableProps> = ({
  labelHeader,
  countHeader,
  rows,
}) => {
  const legendRows: ReportLegendRow[] = rows.map((row) => {
    const percentage =
      row.total > 0
        ? Math.min(100, Math.max(0, (row.count / row.total) * 100))
        : 0;

    return {
      key: row.key,
      marker: (
        <div className={classes.track} aria-hidden="true">
          <div
            className={classNames(classes.fill, classes[row.color])}
            style={{ width: `${percentage}%` }}
            data-testid={`metric-bar-${row.key}`}
          />
        </div>
      ),
      label: row.label,
      count: row.count,
      countHref: row.countHref,
      onCountActivate: row.onCountActivate,
      countAriaLabel: row.countAriaLabel,
    };
  });

  return (
    <ReportLegendTable
      variant="bar"
      markerHeader="Proportion"
      labelHeader={labelHeader}
      countHeader={countHeader}
      rows={legendRows}
    />
  );
};

export default MetricBarTable;
