import classNames from "classnames";
import type { FC } from "react";
import { useId, useState } from "react";
import type { ReportLegendRow } from "../ReportLegendTable";
import ReportLegendTable from "../ReportLegendTable";
import classes from "./ReportDonutChart.module.scss";

export type DonutColor =
  | "red"
  | "orange"
  | "orangeLight"
  | "greenLight"
  | "green"
  | "grey";

export interface DonutSegment {
  readonly key: string;
  readonly label: string;
  readonly detail?: string;
  readonly count: number;
  readonly color: DonutColor;
  readonly countHref?: string;
  readonly onCountActivate?: () => void;
  readonly countAriaLabel?: string;
}

interface ReportDonutChartProps {
  readonly total: number;
  readonly segments: readonly DonutSegment[];
  readonly labelHeader: string;
  readonly countHeader: string;
}

const VIEW_BOX = 100;
const CENTER = VIEW_BOX / 2;
const RADIUS = 40;
const STROKE_WIDTH = 9;
const FULL_PATH_LENGTH = 100;
// Shifts the start of the first arc from 3 o'clock to 12 o'clock.
const START_OFFSET = 25;
// Each arc is shortened by this much so a thin gap shows between segments.
const SEGMENT_GAP = 0.6;
// Smallest visible arc, so a tiny non-zero segment still shows a sliver.
const MIN_VISIBLE_ARC = 0.5;
const CENTER_NUMBER_DY = -3;
const CENTER_SUBLABEL_DY = 8;

// Compact notation keeps the centre readable for any fleet size (200000 →
// "200K"), matching the overview donut.
const compactNumberFormatter = new Intl.NumberFormat(undefined, {
  notation: "compact",
  maximumFractionDigits: 1,
});
const formatCount = (value: number): string =>
  compactNumberFormatter.format(value);

const ReportDonutChart: FC<ReportDonutChartProps> = ({
  total,
  segments,
  labelHeader,
  countHeader,
}) => {
  const titleId = useId();
  const descId = useId();
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const activeSegment =
    activeKey != null
      ? segments.find((segment) => segment.key === activeKey)
      : undefined;
  const centerNumber = formatCount(activeSegment ? activeSegment.count : total);
  const centerSubLabel = activeSegment
    ? `of ${formatCount(total)}`
    : "instances";

  const description = `${total} instances total: ${segments
    .map((segment) => `${segment.count} ${segment.label.toLowerCase()}`)
    .join(", ")}.`;

  const percentages = segments.map((segment) =>
    total > 0 ? (segment.count / total) * FULL_PATH_LENGTH : 0,
  );
  const arcs = segments.map((segment, index) => {
    const percentage = percentages[index] ?? 0;
    return {
      key: segment.key,
      percentage,
      // Shorten the visible arc so a thin gap follows it; tiny segments keep a
      // sliver so they remain visible.
      dash:
        percentage > 0
          ? Math.max(percentage - SEGMENT_GAP, MIN_VISIBLE_ARC)
          : 0,
      offset:
        START_OFFSET -
        percentages.slice(0, index).reduce((sum, value) => sum + value, 0),
      color: segment.color,
    };
  });

  const rows: ReportLegendRow[] = segments.map((segment) => ({
    key: segment.key,
    marker: (
      <span
        className={classNames(classes.dot, classes[segment.color])}
        aria-hidden="true"
      />
    ),
    label: segment.label,
    detail: segment.detail,
    count: segment.count,
    countHref: segment.countHref,
    onCountActivate: segment.onCountActivate,
    countAriaLabel: segment.countAriaLabel,
  }));

  return (
    <div className={classes.layout}>
      <div className={classes.chart}>
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`}
          className={classes.svg}
        >
          <title id={titleId}>Report breakdown</title>
          <desc id={descId}>{description}</desc>
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE_WIDTH}
            className={classes.track}
          />
          {arcs.map(
            (arc) =>
              arc.percentage > 0 && (
                <circle
                  key={arc.key}
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  strokeWidth={STROKE_WIDTH}
                  strokeLinecap="butt"
                  pathLength={FULL_PATH_LENGTH}
                  strokeDasharray={`${arc.dash} ${FULL_PATH_LENGTH - arc.dash}`}
                  strokeDashoffset={arc.offset}
                  className={classNames(classes.arc, classes[arc.color], {
                    [classes.arcActive]: activeKey === arc.key,
                  })}
                  data-testid={`donut-arc-${arc.key}`}
                  onMouseEnter={() => {
                    setActiveKey(arc.key);
                  }}
                  onMouseLeave={() => {
                    setActiveKey(null);
                  }}
                />
              ),
          )}
          <text
            x={CENTER}
            y={CENTER}
            dy={CENTER_NUMBER_DY}
            className={classes.centerNumber}
            data-testid="donut-total"
            aria-hidden="true"
          >
            {centerNumber}
          </text>
          <text
            x={CENTER}
            y={CENTER}
            dy={CENTER_SUBLABEL_DY}
            className={classes.centerSubLabel}
            data-testid="donut-sublabel"
            aria-hidden="true"
          >
            {centerSubLabel}
          </text>
        </svg>
      </div>
      <div className={classes.legend}>
        <ReportLegendTable
          variant="dot"
          labelHeader={labelHeader}
          countHeader={countHeader}
          rows={rows}
          activeKey={activeKey}
          onRowHover={setActiveKey}
        />
      </div>
    </div>
  );
};

export default ReportDonutChart;
