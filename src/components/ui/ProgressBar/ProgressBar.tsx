import type { FC } from "react";
import classes from "./ProgressBar.module.scss";

interface ProgressBarProps {
  readonly progressPercent: number;
}

const ProgressBar: FC<ProgressBarProps> = ({ progressPercent }) => {
  return (
    <>
      <div className={classes.progressBar}>
        <div style={{ width: `${progressPercent}%` }} />
      </div>
      <span>{progressPercent}%</span>
    </>
  );
};

export default ProgressBar;
