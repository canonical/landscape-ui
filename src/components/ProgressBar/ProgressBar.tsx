import type { FC } from "react";
import { MAX_PROGRESS } from "./constants";
import { getEtaLabel } from "./helpers";
import classes from "./ProgressBar.module.scss";

export interface ProgressBarProps {
  readonly progress: number;
  readonly secondsRemaining: number | null;
  readonly fullWidth?: boolean;
}

const ProgressBar: FC<ProgressBarProps> = ({
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
      <div
        className={classes.bar}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={MAX_PROGRESS}
        aria-label="Progress"
      >
        <div className={classes.fill} style={{ width: `${clampedProgress}%` }} />
      </div>
      <span className={classes.percentage}>{clampedProgress}%</span>
      <span className={classes.eta}>{getEtaLabel(secondsRemaining)}</span>
    </div>
  );
};

export default ProgressBar;
