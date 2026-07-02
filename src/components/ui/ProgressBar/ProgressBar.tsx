import type { FC } from "react";
import classes from "./ProgressBar.module.scss";

interface ProgressBarProps {
  readonly progressPercent: number;
  readonly labelledBy?: string;
}

const ProgressBar: FC<ProgressBarProps> = ({ progressPercent, labelledBy }) => {
  return (
    <>
      <div
        className={classes.progressBar}
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-labelledby={labelledBy}
      >
        <div style={{ width: `${progressPercent}%` }} />
      </div>
      <span aria-hidden="true">{progressPercent}%</span>
    </>
  );
};

export default ProgressBar;
