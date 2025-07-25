import type { FC } from "react";
import classNames from "classnames";
import classes from "../../AlertCard.module.scss";

const EmptyAlertCount: FC = () => {
  return (
    <span
      className={classNames(
        "u-no-margin u-no-padding u-text--muted",
        classes.link,
      )}
    >
      <span className={classes.instancesNumber}>0</span> instances
    </span>
  );
};

export default EmptyAlertCount;
