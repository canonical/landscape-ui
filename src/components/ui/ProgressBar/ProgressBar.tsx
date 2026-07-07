import type { FC } from "react";
import classes from "./ProgressBar.module.scss";

interface ProgressBarProps {
  readonly progress: number;
  readonly labelledBy?: string;
}

const ProgressBar: FC<ProgressBarProps> = ({ progress, labelledBy }) => {
  return (
    <>
      <div
        className={classes.progressBar}
        role="progressbar"
        aria-valuenow={progress}
        aria-labelledby={labelledBy}
      >
        <div style={{ width: `${progress}%` }} />
      </div>
      <span aria-hidden="true">{progress}%</span>
    </>
  );
};

export default ProgressBar;
