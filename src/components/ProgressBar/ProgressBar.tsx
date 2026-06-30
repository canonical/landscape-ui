import type { FC } from "react";
import { MAX_PROGRESS } from "./constants";
import { getEtaLabel } from "./helpers";
import classes from "./ProgressBar.module.scss";
import classNames from "classnames";

export interface ProgressBarProps {
  readonly progress: number;
  readonly secondsRemaining: number | null;
  readonly fullWidth?: boolean;
  readonly loading?: boolean;
}

const ProgressBar: FC<ProgressBarProps> = ({
  progress,
  secondsRemaining,
  fullWidth = false,
  loading = false,
}) => {
  const clampedProgress = Math.min(
    MAX_PROGRESS,
    Math.max(0, Math.round(progress)),
  );

  return (
    <div className={`${classes.wrapper} ${fullWidth ? classes.fullWidth : ""}`}>
      {loading && (
        <i className="p-icon--spinner u-animation--spin" aria-hidden="true" />
      )}
      <div className={classes.content}>
        <div
          className={classes.bar}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={MAX_PROGRESS}
          aria-label="Progress"
        >
          <div
            className={classes.fill}
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
        <span
          className={classNames(
            classes.percentage,
            "p-text--small u-no-margin--bottom",
          )}
        >
          {clampedProgress}%
        </span>
        <span
          className={classNames(
            classes.eta,
            "p-text--small u-no-margin--bottom",
          )}
        >
          {getEtaLabel(secondsRemaining)}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
