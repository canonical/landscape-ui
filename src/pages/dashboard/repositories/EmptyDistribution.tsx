import { FC } from "react";
import classes from "./SeriesCard.module.scss";

const EmptyDistribution: FC = () => {
  return (
    <div className={`${classes.card} ${classes.empty}`}>
      <div className={classes.header}>
        <h3 className={classes.title}>No series have been created yet</h3>
      </div>
      <p />
    </div>
  );
};

export default EmptyDistribution;
