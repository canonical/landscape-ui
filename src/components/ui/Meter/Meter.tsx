import type { CSSProperties, ReactElement } from "react";
import type { MeterProps } from "./types";
import "./styles.css";

const componentCssClassName = "ds meter";
const DEFAULT_MAX = 100;
const PERCENT = 100;

/** Returns a horizontal gauge for a scalar value within a known range. */
const Meter = ({
  value,
  min = 0,
  max = DEFAULT_MAX,
  criticality,
  className,
  style,
  ...props
}: MeterProps): ReactElement => {
  const clamped = Math.min(max, Math.max(min, value));
  const fill = max > min ? ((clamped - min) / (max - min)) * PERCENT : 0;

  return (
    <div
      className={[componentCssClassName, criticality, className]
        .filter(Boolean)
        .join(" ")}
      role="meter"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={clamped}
      style={{ ...style, "--meter-fill": `${fill}%` } as CSSProperties}
      {...props}
    >
      <div className="fill" />
    </div>
  );
};

export default Meter;
