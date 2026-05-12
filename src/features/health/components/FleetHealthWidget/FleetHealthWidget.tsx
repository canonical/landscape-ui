import classNames from "classnames";
import type { FC } from "react";
import { useId, useMemo, useState } from "react";
import type { FleetHealthSummary, HealthBand } from "../../types";
import classes from "./FleetHealthWidget.module.scss";

// SVG geometry — a single donut ring split into three band-colored arcs.
// Coordinates use a centered 100x100 viewBox so the math reads naturally.
const VIEW_BOX = 100;
const CENTER = VIEW_BOX / 2;
const RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const STROKE_WIDTH = 10;
const CENTER_LABEL_OFFSET = 12;
const STARTING_ROTATION = -90; // start the first slice at 12 o'clock

interface BandRow {
  band: HealthBand;
  label: string;
  count: number;
  swatch: string;
  arc: string;
}

interface FleetHealthWidgetProps {
  readonly summary: FleetHealthSummary | undefined;
  readonly isLoading?: boolean;
  readonly isError?: boolean;
  readonly heading?: string;
  readonly description?: string;
  readonly onBandSelect?: (band: HealthBand) => void;
}

const BAND_ORDER: readonly HealthBand[] = ["critical", "warning", "healthy"];

const BAND_DEFS: Record<HealthBand, Omit<BandRow, "count">> = {
  critical: {
    band: "critical",
    label: "Critical",
    swatch: classes["swatch--critical"],
    arc: classes["arc--critical"],
  },
  warning: {
    band: "warning",
    label: "Warning",
    swatch: classes["swatch--warning"],
    arc: classes["arc--warning"],
  },
  healthy: {
    band: "healthy",
    label: "Healthy",
    swatch: classes["swatch--healthy"],
    arc: classes["arc--healthy"],
  },
};

const computeRows = (summary: FleetHealthSummary): BandRow[] => [
  { ...BAND_DEFS.critical, count: summary.band_critical_count },
  { ...BAND_DEFS.warning, count: summary.band_warning_count },
  { ...BAND_DEFS.healthy, count: summary.band_healthy_count },
];

/** Worst (most-urgent) non-empty band, for the center number's anchor. */
const worstBand = (rows: BandRow[]): BandRow => {
  const worst = rows.find((r) => r.count > 0);
  return worst ?? rows[rows.length - 1];
};

const FleetHealthWidget: FC<FleetHealthWidgetProps> = ({
  summary,
  isLoading,
  isError,
  heading = "Fleet health",
  description = "How instances are distributed across health bands.",
  onBandSelect,
}) => {
  const titleId = useId();
  const descId = useId();
  const [hovered, setHovered] = useState<HealthBand | null>(null);

  const rows = useMemo<BandRow[]>(
    () => (summary ? computeRows(summary) : []),
    [summary],
  );

  if (isLoading || (!summary && !isError)) {
    return (
      <div className={classes.root} aria-busy="true" aria-label="Loading fleet health">
        <div className={classes.chartWrapper}>
          <div className={classes.skeleton} />
        </div>
        <div className={classes.legend}>
          <h2 className={classes.legendHeading}>{heading}</h2>
          <p className={classes.legendDescription}>{description}</p>
        </div>
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className={classes.root}>
        <div className={classes.error} role="alert">
          Couldn&apos;t load fleet health. Try again in a moment.
        </div>
      </div>
    );
  }

  const total = summary.total_count;

  if (total === 0) {
    return (
      <div className={classes.root}>
        <div className={classes.empty}>
          <strong>No instances yet</strong>
          <span>
            Register a computer to start seeing fleet health here.
          </span>
        </div>
      </div>
    );
  }

  // Pre-compute the arc dasharray + offset for each ring segment, in band order.
  let cumulative = 0;
  const segments = rows.map((row) => {
    const length = (row.count / total) * CIRCUMFERENCE;
    const dasharray = `${length} ${CIRCUMFERENCE}`;
    // -90deg rotation puts segment 0 starting at 12 o'clock; subsequent
    // segments rotate by the cumulative angle.
    const rotation = STARTING_ROTATION + (cumulative / total) * 360;
    cumulative += row.count;
    return { ...row, dasharray, rotation };
  });

  const focus = hovered ?? worstBand(rows).band;
  const focusRow = rows.find((r) => r.band === focus) ?? worstBand(rows);

  return (
    <div
      className={classes.root}
      role="group"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div className={classes.chartWrapper}>
        <svg
          className={classes.svg}
          viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`}
          role="img"
          aria-label={`${total} instances: ${rows
            .map((r) => `${r.count} ${r.label.toLowerCase()}`)
            .join(", ")}.`}
        >
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            className={classes.track}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          {segments.map((seg) =>
            seg.count === 0 ? null : (
              <circle
                key={seg.band}
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="butt"
                strokeDasharray={seg.dasharray}
                transform={`rotate(${seg.rotation} ${CENTER} ${CENTER})`}
                className={classNames(classes.arc, seg.arc, {
                  [classes["arc--active"]]: hovered === seg.band,
                  [classes["arc--inactive"]]:
                    hovered !== null && hovered !== seg.band,
                })}
                tabIndex={0}
                role="button"
                aria-label={`${seg.label}: ${seg.count} of ${total}`}
                onMouseEnter={() => { setHovered(seg.band); }}
                onMouseLeave={() => { setHovered(null); }}
                onFocus={() => { setHovered(seg.band); }}
                onBlur={() => { setHovered(null); }}
                onClick={onBandSelect ? () => { onBandSelect(seg.band); } : undefined}
                onKeyDown={(e) => {
                  if (onBandSelect && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onBandSelect(seg.band);
                  }
                }}
              />
            ),
          )}
          <text
            x={CENTER}
            y={CENTER}
            className={classes.centerNumber}
            aria-hidden="true"
          >
            {focusRow.count}
          </text>
          <text
            x={CENTER}
            y={CENTER}
            dy={CENTER_LABEL_OFFSET}
            className={classes.centerLabel}
            aria-hidden="true"
          >
            {focusRow.label}
          </text>
        </svg>
      </div>

      <div className={classes.legend}>
        <h2 id={titleId} className={classes.legendHeading}>
          {heading}
        </h2>
        <p id={descId} className={classes.legendDescription}>
          {description}
        </p>
        <ul className={classes.legendList}>
          {BAND_ORDER.map((band) => {
            const row = rows.find((r) => r.band === band);
            if (!row) return null;
            return (
              <li key={band}>
                <button
                  type="button"
                  className={classes.legendItem}
                  aria-pressed={hovered === band}
                  onMouseEnter={() => { setHovered(band); }}
                  onMouseLeave={() => { setHovered(null); }}
                  onFocus={() => { setHovered(band); }}
                  onBlur={() => { setHovered(null); }}
                  onClick={onBandSelect ? () => { onBandSelect(band); } : undefined}
                >
                  <span
                    className={classNames(classes.swatch, row.swatch)}
                    aria-hidden="true"
                  />
                  <span className={classes.legendLabel}>{row.label}</span>
                  <span className={classes.legendCount}>{row.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default FleetHealthWidget;
