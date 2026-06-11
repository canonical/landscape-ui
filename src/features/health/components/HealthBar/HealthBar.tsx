import { Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { BAND_ICON, BAND_LABEL } from "../../helpers";
import type { ComputerHealth, HealthBand } from "../../types";
import classes from "./HealthBar.module.scss";

const BAND_MOD_CLASS: Record<HealthBand, string | undefined> = {
  critical: classes.bandCritical,
  warning: classes.bandWarning,
  healthy: classes.bandHealthy,
};

export interface HealthBarProps {
  readonly health?: ComputerHealth | undefined;
  readonly isLoading?: boolean;
  readonly isError?: boolean;
  readonly notMeasurable?: boolean;
  readonly compact?: boolean;
  readonly className?: string;
}

const HealthBar: FC<HealthBarProps> = ({
  health,
  isLoading,
  isError,
  notMeasurable,
  compact,
  className,
}) => {
  if (notMeasurable) {
    return (
      <span
        className={classNames(classes.root, classes.notMeasurable, className)}
        aria-label="Health not measurable for this instance"
      >
        <span className={classes.score} aria-hidden="true">
          —
        </span>
        <span className={classes.bandLabel}>Not measured</span>
      </span>
    );
  }

  if (isLoading || (!health && !isError)) {
    return (
      <span
        className={classNames(classes.root, classes.skeleton, className)}
        aria-busy="true"
        aria-label="Loading health score"
      >
        <span className={classNames(classes.iconSlot, classes.shimmer)} />
        <span className={classNames(classes.score, classes.shimmer)}>
          &nbsp;&nbsp;
        </span>
        <span className={classNames(classes.bar, classes.shimmer)} />
      </span>
    );
  }

  if (isError || !health) {
    return (
      <span
        className={classNames(classes.root, classes.errored, className)}
        aria-label="Health score unavailable"
      >
        <span className={classes.iconSlot} aria-hidden="true">
          <Icon name="help" />
        </span>
        <span className={classes.score} aria-hidden="true">
          —
        </span>
        <span className={classes.bandLabel}>Unavailable</span>
      </span>
    );
  }

  const { score, band, critical_factor_count } = health;
  const fillWidth = `${Math.max(0, Math.min(100, score))}%`;
  const factorCount = health.factors.length;
  const ariaLabel = `Health ${score} out of 100, ${BAND_LABEL[band]}${
    factorCount ? `, ${factorCount} factor${factorCount > 1 ? "s" : ""}` : ""
  }.`;

  return (
    <span
      className={classNames(
        classes.root,
        BAND_MOD_CLASS[band],
        compact && classes.compact,
        className,
      )}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={score}
      aria-valuetext={ariaLabel}
      aria-label={ariaLabel}
    >
      <span className={classes.iconSlot} aria-hidden="true">
        <Icon name={BAND_ICON[band]} />
      </span>
      <span className={classes.score}>{score}</span>
      <span className={classes.bar} aria-hidden="true">
        <span
          className={classes.fill}
          style={{ width: fillWidth }}
        />
      </span>
      {critical_factor_count > 1 ? (
        <span
          className={classes.criticalCount}
          aria-hidden="true"
          title={`${critical_factor_count} critical factors`}
        >
          ×{critical_factor_count}
        </span>
      ) : null}
    </span>
  );
};

export default HealthBar;
