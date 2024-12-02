import { FC } from "react";
import classes from "./Redirecting.module.scss";

const Redirecting: FC = () => {
  return (
    <div className={classes.root}>
      <span role="status" className={classes.icon}>
        <span className="u-off-screen">Redirecting...</span>
        <i className="p-icon--spinner u-animation--spin" aria-hidden />
      </span>
      <span>Redirecting...</span>
    </div>
  );
};

export default Redirecting;
