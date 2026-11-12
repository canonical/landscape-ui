import LoadingState from "@/components/layout/LoadingState";
import classNames from "classnames";
import type { FC } from "react";
import type { ComputerHealth } from "../../types";
import HealthScore from "../HealthScore";
import classes from "./HealthBar.module.scss";

export interface HealthBarProps {
  readonly health?: Pick<ComputerHealth, "score" | "band"> | undefined;
  readonly isLoading?: boolean;
  readonly isError?: boolean;
  readonly notMeasurable?: boolean;
  readonly className?: string;
}

/** Returns an instance's health score, or the reason there is none. */
const HealthBar: FC<HealthBarProps> = ({
  health,
  isLoading,
  isError,
  notMeasurable,
  className,
}) => {
  if (notMeasurable) {
    return (
      <span className={classNames(classes.placeholder, className)}>
        Not measured
      </span>
    );
  }

  if (isLoading || (!health && !isError)) {
    return <LoadingState inline />;
  }

  if (isError || !health) {
    return (
      <span className={classNames(classes.placeholder, className)}>
        Unavailable
      </span>
    );
  }

  return (
    <HealthScore
      className={classNames(classes.score, className)}
      score={health.score}
      band={health.band}
    />
  );
};

export default HealthBar;
