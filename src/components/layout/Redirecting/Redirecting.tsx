import LoadingState from "../LoadingState";
import type { FC } from "react";
import classes from "./Redirecting.module.scss";

const Redirecting: FC = () => {
  return (
    <div className={classes.root}>
      <span className={classes.icon}>
        <LoadingState inline />
      </span>
      <span>Redirecting...</span>
    </div>
  );
};

export default Redirecting;
