import classNames from "classnames";
import type { FC, KeyboardEvent, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { CRITICAL_SCORE_CEILING, HEALTHY_SCORE_FLOOR } from "../../helpers";
import type { MeasurementChange } from "../../history";
import { addDays, daysBetween } from "../../history";
import type { FleetHealthThresholds } from "../../types";
import classes from "./HealthTrendChart.module.scss";

export interface TrendPoint {
  // UTC date, `YYYY-MM-DD`.
  date: string;
  // Null where the line ends, for example when an instance became unmeasured.
  value: number | null;
}

interface HealthTrendChartProps {
  // Ascending by date.
  readonly points: TrendPoint[];
  readonly from: string;
  readonly to: string;
  // "line" joins daily points. "step" holds each value until the next point.
  readonly variant?: "line" | "step";
  readonly markers?: MeasurementChange[];
  readonly thresholds?: FleetHealthThresholds;
  // Zooms the score axis to the values shown instead of the full 0 to 100.
  readonly fitToValues?: boolean;
  // Names the chart and the value column, for example "Average score".
  readonly valueLabel: string;
  readonly className?: string;
}

const MAX_SCORE = 100;
const FIT_STEP = 10;
const DEFAULT_WIDTH = 640;
const HEIGHT = 184;
const MARGIN = { top: 20, right: 12, bottom: 24, left: 32 };
const X_TICK_COUNT = 5;
const DOT_RADIUS = 4;
const TICK_LABEL_OFFSET = 16;
const AXIS_LABEL_GAP = 8;
const TEXT_BASELINE_SHIFT = 4;
const MARKER_LABEL_OFFSET = 6;
const HALF = 0.5;
const PERCENT = 100;

const DEFAULT_THRESHOLDS: FleetHealthThresholds = {
  critical_max: CRITICAL_SCORE_CEILING,
  warning_max: HEALTHY_SCORE_FLOOR - 1,
};

const shortDate = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const longDate = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const formatDay = (day: string, format = longDate): string =>
  format.format(new Date(day));

/** Returns the width of an element, tracking its resizes. */
const useWidth = (): [React.RefObject<HTMLDivElement | null>, number] => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === "undefined") {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect.width > 0) {
        setWidth(Math.round(entry.contentRect.width));
      }
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);
  return [ref, width];
};

/** Returns the score range the axis covers. */
const scoreDomain = (points: TrendPoint[], fit: boolean): [number, number] => {
  const values = points.flatMap(({ value }) => (value === null ? [] : [value]));
  if (!fit || values.length === 0) {
    return [0, MAX_SCORE];
  }
  // One band of ten above and below the values, and at least two in view.
  const low = Math.max(
    0,
    Math.floor(Math.min(...values) / FIT_STEP) * FIT_STEP - FIT_STEP,
  );
  const high = Math.min(
    MAX_SCORE,
    Math.max(
      Math.ceil(Math.max(...values) / FIT_STEP) * FIT_STEP + FIT_STEP,
      low + FIT_STEP * 2,
    ),
  );
  return [low, high];
};

/** Returns the SVG path of the series and the points no segment touches. */
const trace = (
  points: TrendPoint[],
  variant: "line" | "step",
  x: (day: string) => number,
  y: (value: number) => number,
  to: string,
): { path: string; isolated: TrendPoint[] } => {
  let path = "";
  const isolated: TrendPoint[] = [];
  points.forEach((point, index) => {
    if (point.value === null) {
      return;
    }
    const previous = points[index - 1];
    const next = points[index + 1];
    const px = x(point.date);
    const py = y(point.value);
    if (variant === "step") {
      path += `M${px},${py}H${x(next?.date ?? to)}`;
      if (next && next.value !== null) {
        path += `V${y(next.value)}`;
      }
      return;
    }
    // A missing day breaks a daily line instead of bridging the gap.
    const joinsPrevious =
      previous?.value != null && daysBetween(previous.date, point.date) === 1;
    const joinsNext =
      next?.value != null && daysBetween(point.date, next.date) === 1;
    path += `${joinsPrevious ? "L" : "M"}${px},${py}`;
    if (!joinsPrevious && !joinsNext) {
      isolated.push(point);
    }
  });
  return { path, isolated };
};

const TICK_ANCHORS = ["start", "middle", "middle", "middle", "end"] as const;

const HealthTrendChart: FC<HealthTrendChartProps> = ({
  points,
  from,
  to,
  variant = "line",
  markers = [],
  thresholds = DEFAULT_THRESHOLDS,
  fitToValues = false,
  valueLabel,
  className,
}) => {
  const [ref, width] = useWidth();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // The day being read. On a step line it can be later than the point's own.
  const [activeDay, setActiveDay] = useState<string | null>(null);

  const activate = (index: number | null, day?: string) => {
    setActiveIndex(index);
    setActiveDay(index === null ? null : (day ?? points[index]?.date ?? null));
  };

  const span = Math.max(1, daysBetween(from, to));
  const plotWidth = Math.max(1, width - MARGIN.left - MARGIN.right);
  const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
  const bottom = MARGIN.top + plotHeight;
  const x = (day: string): number =>
    MARGIN.left + (daysBetween(from, day) / span) * plotWidth;

  const [low, high] = scoreDomain(points, fitToValues);
  const isFitted = low !== 0 || high !== MAX_SCORE;
  const y = (value: number): number =>
    MARGIN.top + (1 - (value - low) / (high - low)) * plotHeight;

  // The full scale is ticked at the band boundaries, a fitted one every ten.
  const yTicks = isFitted
    ? Array.from(
        { length: (high - low) / FIT_STEP + 1 },
        (_, index) => low + index * FIT_STEP,
      )
    : [0, thresholds.critical_max, thresholds.warning_max, MAX_SCORE];
  const xTicks = Array.from({ length: X_TICK_COUNT }, (_, index) =>
    addDays(from, Math.round((span * index) / (X_TICK_COUNT - 1))),
  );

  // Where each point's value stops applying: the next point for a step line,
  // the point itself for a daily line.
  const endOf = (index: number): string =>
    variant === "step"
      ? (points[index + 1]?.date ?? to)
      : (points[index]?.date ?? to);

  const { path, isolated } = trace(points, variant, x, y, to);

  const last = points.findLast(({ value }) => value !== null);
  const lastIndex = last ? points.indexOf(last) : -1;

  const active = activeIndex === null ? undefined : points[activeIndex];

  /** Returns the index of the point that applies on a day. */
  const indexOn = (day: string): number | null => {
    if (points.length === 0) {
      return null;
    }
    if (variant === "step") {
      const index = points.findLastIndex(({ date }) => date <= day);
      return index === -1 ? null : index;
    }
    let nearest = 0;
    points.forEach((point, index) => {
      const best = points[nearest]?.date ?? point.date;
      if (
        Math.abs(daysBetween(point.date, day)) <
        Math.abs(daysBetween(best, day))
      ) {
        nearest = index;
      }
    });
    return nearest;
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left - MARGIN.left) / plotWidth;
    const day = addDays(
      from,
      Math.round(Math.min(1, Math.max(0, ratio)) * span),
    );
    const index = indexOn(day);
    activate(index, variant === "step" ? day : undefined);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (points.length === 0) {
      return;
    }
    const current = activeIndex ?? points.length - 1;
    const moves: Record<string, number> = {
      ArrowLeft: Math.max(0, current - 1),
      ArrowRight: Math.min(points.length - 1, current + 1),
      Home: 0,
      End: points.length - 1,
    };
    const next = moves[event.key];
    if (next === undefined) {
      if (event.key === "Escape") {
        activate(null);
      }
      return;
    }
    event.preventDefault();
    activate(next);
  };

  const activeX = active && activeDay ? x(activeDay) : 0;
  const activeMarker = markers.find(({ date }) => date === activeDay);

  return (
    <div
      ref={ref}
      className={classNames(classes.root, className)}
      role="group"
      aria-label={`${valueLabel} from ${formatDay(from)} to ${formatDay(to)}. Use the arrow keys to read each point.`}
      // Focusable so the arrow keys can step through the points.
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        if (activeIndex === null && lastIndex !== -1) {
          activate(lastIndex);
        }
      }}
      onBlur={() => {
        activate(null);
      }}
    >
      <svg
        className={classes.svg}
        width={width}
        height={HEIGHT}
        viewBox={`0 0 ${width} ${HEIGHT}`}
        aria-hidden="true"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => {
          activate(null);
        }}
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              className={classes.grid}
              x1={MARGIN.left}
              x2={width - MARGIN.right}
              y1={y(tick)}
              y2={y(tick)}
            />
            <text
              className={classes.tick}
              x={MARGIN.left - AXIS_LABEL_GAP}
              y={y(tick) + TEXT_BASELINE_SHIFT}
              textAnchor="end"
            >
              {tick}
            </text>
          </g>
        ))}
        {xTicks.map((tick, index) => (
          <text
            key={tick}
            className={classes.tick}
            x={x(tick)}
            y={bottom + TICK_LABEL_OFFSET}
            textAnchor={TICK_ANCHORS[index] ?? "middle"}
          >
            {formatDay(tick, shortDate)}
          </text>
        ))}
        {markers.map((marker) => {
          const mx = x(marker.date);
          const isRightHalf = mx > MARGIN.left + plotWidth * HALF;
          return (
            <g key={marker.date}>
              <line
                className={classes.marker}
                x1={mx}
                x2={mx}
                y1={MARGIN.top - AXIS_LABEL_GAP}
                y2={bottom}
              />
              <text
                className={classes.tick}
                x={
                  mx +
                  (isRightHalf ? -MARKER_LABEL_OFFSET : MARKER_LABEL_OFFSET)
                }
                y={MARGIN.top - TEXT_BASELINE_SHIFT}
                textAnchor={isRightHalf ? "end" : "start"}
              >
                {marker.label}
              </text>
            </g>
          );
        })}
        {path ? <path className={classes.line} d={path} /> : null}
        {isolated.map((point) => (
          <circle
            key={point.date}
            className={classes.dot}
            cx={x(point.date)}
            cy={y(point.value ?? 0)}
            r={DOT_RADIUS / 2}
          />
        ))}
        {last && last.value !== null ? (
          <circle
            className={classes.dot}
            cx={x(endOf(lastIndex))}
            cy={y(last.value)}
            r={DOT_RADIUS}
          />
        ) : null}
        {active ? (
          <>
            <line
              className={classes.crosshair}
              x1={activeX}
              x2={activeX}
              y1={MARGIN.top}
              y2={bottom}
            />
            {active.value === null ? null : (
              <circle
                className={classes.dot}
                cx={activeX}
                cy={y(active.value)}
                r={DOT_RADIUS}
              />
            )}
          </>
        ) : null}
      </svg>

      {active ? (
        <div
          className={classNames(classes.tooltip, {
            [classes.tooltipLeft]: activeX > MARGIN.left + plotWidth * HALF,
          })}
          style={{ left: `${(activeX / width) * PERCENT}%` }}
          role="status"
        >
          <span className={classes.tooltipDate}>
            {formatDay(activeDay ?? active.date)}
          </span>
          <span>
            {valueLabel}: <strong>{active.value ?? "not measured"}</strong>
          </span>
          {activeMarker ? <span>{activeMarker.label}</span> : null}
        </div>
      ) : null}

      <table className="u-off-screen">
        <caption>{valueLabel} by day</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.date}>
              <th scope="row">{formatDay(point.date)}</th>
              <td>{point.value ?? "Not measured"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HealthTrendChart;
