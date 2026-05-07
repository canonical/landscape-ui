import { useTheme } from "@/context/theme";
import classNames from "classnames";
import type { FC } from "react";
import { useId, useState } from "react";
import { colorMap } from "../../constants";
import type { Color } from "../../types";
import Legend from "../Legend";
import classes from "./DonutChart.module.scss";

export interface DonutRing {
  readonly label: string;
  readonly count: number;
  readonly colorKey: Exclude<Color, "background">;
}

interface DonutChartProps {
  readonly title: string;
  readonly total: number;
  readonly rings: readonly DonutRing[];
}

const VIEW_BOX = 100;
const CENTER = VIEW_BOX / 2;
const STROKE_WIDTH = 8;
const OUTER_RADIUS = 42;
const MIDDLE_RADIUS = 32;
const INNER_RADIUS = 22;
const RING_RADII = [OUTER_RADIUS, MIDDLE_RADIUS, INNER_RADIUS] as const;
const FULL_PATH_LENGTH = 100;
const CENTER_SUBLABEL_DY = 8;

const computeProportion = (count: number, total: number): number => {
  if (total <= 0) {
    return 0;
  }
  const ratio = (count / total) * FULL_PATH_LENGTH;
  return Math.max(0, Math.min(FULL_PATH_LENGTH, ratio));
};

const formatPercent = (proportion: number): string => {
  return `${Math.round(proportion)}%`;
};

const COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const formatCount = (count: number): string => {
  return COMPACT_NUMBER_FORMATTER.format(count);
};

const DonutChart: FC<DonutChartProps> = ({ title, total, rings }) => {
  const { isDarkMode } = useTheme();
  const [selectedArc, setSelectedArc] = useState<number | null>(null);
  const titleId = useId();
  const descId = useId();
  const mode = isDarkMode ? "dark" : "light";

  const description = `${total} instances total: ${rings
    .map((ring) => `${ring.count} ${ring.label.toLowerCase()}`)
    .join(", ")}.`;

  const selectedRing =
    selectedArc !== null ? (rings[selectedArc] ?? null) : null;
  const centerNumber = formatCount(selectedRing ? selectedRing.count : total);
  const centerSubLabel = selectedRing
    ? `of ${formatCount(total)}`
    : "instances";

  const handleArcEnter = (index: number): void => {
    setSelectedArc(index);
  };
  const handleArcLeave = (): void => {
    setSelectedArc(null);
  };

  return (
    <div className={classes.outerContainer}>
      <p className={classNames("u-no-padding u-no-margin", classes.title)}>
        {title}
      </p>
      <div className={classes.innerContainer} onMouseLeave={handleArcLeave}>
        <Legend
          items={rings.map((ring) => ({
            label: ring.label,
            count: ring.count,
          }))}
          selectedArc={selectedArc}
          onArcEnter={handleArcEnter}
          onArcLeave={handleArcLeave}
        />
        <div className={classes.chartContainer}>
          <svg
            role="img"
            aria-labelledby={`${titleId} ${descId}`}
            viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`}
            className={classes.svg}
          >
            <title id={titleId}>{title}</title>
            <desc id={descId}>{description}</desc>
            {rings.map((ring, index) => {
              const radius = RING_RADII[index] ?? RING_RADII[0];
              const proportion = computeProportion(ring.count, total);
              const isActive = selectedArc === index;
              const isInactive = selectedArc !== null && !isActive;
              const ringColor = colorMap[ring.colorKey][mode].default;

              return (
                <g
                  key={ring.label}
                  role="img"
                  aria-label={`${ring.label}: ${ring.count} of ${total} instances (${formatPercent(proportion)})`}
                  tabIndex={0}
                  className={classNames(classes.ring, {
                    [classes["ring--active"]]: isActive,
                    [classes["ring--inactive"]]: isInactive,
                  })}
                  onMouseEnter={() => {
                    handleArcEnter(index);
                  }}
                  onFocus={() => {
                    handleArcEnter(index);
                  }}
                  onBlur={handleArcLeave}
                  data-ring-index={index}
                >
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={radius}
                    fill="none"
                    strokeWidth={STROKE_WIDTH}
                    pathLength={FULL_PATH_LENGTH}
                    className={classes.track}
                  />
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={radius}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth={STROKE_WIDTH}
                    strokeLinecap="butt"
                    pathLength={FULL_PATH_LENGTH}
                    strokeDasharray={`${proportion} ${FULL_PATH_LENGTH - proportion}`}
                    style={{ pointerEvents: "stroke" }}
                    transform={`rotate(-90 ${CENTER} ${CENTER})`}
                    data-testid={`donut-arc-${index}`}
                  />
                </g>
              );
            })}
            <text
              x={CENTER}
              y={CENTER}
              className={classes.centerNumber}
              data-testid="donut-center-number"
              aria-hidden="true"
            >
              {centerNumber}
            </text>
            <text
              x={CENTER}
              y={CENTER}
              dy={CENTER_SUBLABEL_DY}
              className={classes.centerSubLabel}
              data-testid="donut-center-sublabel"
              aria-hidden="true"
            >
              {centerSubLabel}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
