import type { FC } from "react";
import { MAX_PROGRESS } from "./constants";
import { getEtaLabel } from "./helpers";
import classes from "./ExportProgressBar.module.scss";

export interface ExportProgressBarProps {
  readonly progress: number;
  readonly secondsRemaining: number | null;
  readonly fullWidth?: boolean;
}

const ExportProgressBar: FC<ExportProgressBarProps> = ({
  progress,
  secondsRemaining,
  fullWidth = false,
}) => {
  const clampedProgress = Math.min(
    MAX_PROGRESS,
    Math.max(0, Math.round(progress)),
  );

  return (
    <div className={`${classes.wrapper} ${fullWidth ? classes.fullWidth : ""}`}>
      <div className={classes.labels}>
        <span className={classes.percentage}>{clampedProgress}%</span>
        <span className={classes.eta}>{getEtaLabel(secondsRemaining)}</span>
      </div>
      <div
        className={classes.bar}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={MAX_PROGRESS}
        aria-label="Export progress"
      >
        <div
          className={classes.fill}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ExportProgressBar;
