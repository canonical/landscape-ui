import type { FC } from "react";
import classes from "./ExportProgressBar.module.scss";

const SECONDS_PER_MINUTE = 60;
// Below this, a precise countdown reads as noise — show "Almost done" instead.
const ALMOST_DONE_THRESHOLD_SECONDS = 5;
const MAX_PROGRESS = 100;

export const formatSecondsRemaining = (seconds: number): string => {
  const safe = Math.max(0, Math.round(seconds));

  if (safe < SECONDS_PER_MINUTE) {
    return `${safe}s left`;
  }

  const minutes = Math.floor(safe / SECONDS_PER_MINUTE);
  const remainderSeconds = safe % SECONDS_PER_MINUTE;

  return remainderSeconds
    ? `${minutes}m ${remainderSeconds}s left`
    : `${minutes}m left`;
};

const getEtaLabel = (secondsRemaining: number | null): string => {
  if (secondsRemaining === null) {
    return "Estimating...";
  }

  if (secondsRemaining <= ALMOST_DONE_THRESHOLD_SECONDS) {
    return "Almost done";
  }

  return formatSecondsRemaining(secondsRemaining);
};

interface ExportProgressBarProps {
  readonly progress: number;
  readonly secondsRemaining: number | null;
}

const ExportProgressBar: FC<ExportProgressBarProps> = ({
  progress,
  secondsRemaining,
}) => {
  const clampedProgress = Math.min(MAX_PROGRESS, Math.max(0, Math.round(progress)));

  return (
    <div className={classes.wrapper}>
      <div
        className={classes.bar}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={MAX_PROGRESS}
        aria-label="Export progress"
      >
        <div className={classes.fill} style={{ width: `${clampedProgress}%` }}>
          <span className={classes.percentage}>{clampedProgress}%</span>
        </div>
      </div>
      <span className={classes.eta}>{getEtaLabel(secondsRemaining)}</span>
    </div>
  );
};

export default ExportProgressBar;
