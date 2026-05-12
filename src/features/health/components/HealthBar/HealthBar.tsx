import { Tooltip } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import type { ComputerHealth, HealthBand, HealthFactor } from "../../types";
import classes from "./HealthBar.module.scss";

const BAND_LABEL: Record<HealthBand, string> = {
  critical: "Critical",
  warning: "Warning",
  healthy: "Healthy",
};

const BAND_FILL_CLASS: Record<HealthBand, string> = {
  critical: classes["fill--critical"],
  warning: classes["fill--warning"],
  healthy: classes["fill--healthy"],
};

interface FactorBreakdownProps {
  readonly factors: HealthFactor[];
}

const FactorBreakdown: FC<FactorBreakdownProps> = ({ factors }) => {
  if (factors.length === 0) {
    return (
      <div className={classes.empty}>No detractors — fully healthy.</div>
    );
  }
  return (
    <table className={classes.factorTable}>
      <thead>
        <tr>
          <th>Factor</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        {factors.map((f) => (
          <tr key={f.rule_id}>
            <td>{f.description || f.rule_key}</td>
            <td>−{f.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export interface HealthBarProps {
  readonly health: ComputerHealth | undefined;
  readonly isLoading?: boolean;
  readonly isError?: boolean;
  readonly className?: string;
}

const HealthBar: FC<HealthBarProps> = ({
  health,
  isLoading,
  isError,
  className,
}) => {
  if (isLoading || (!health && !isError)) {
    return (
      <span
        className={classNames(classes.root, className)}
        aria-busy="true"
        aria-label="Loading health score"
      >
        <span className={classNames(classes.score, classes.skeleton)}>
          &nbsp;&nbsp;&nbsp;
        </span>
        <span className={classNames(classes.bar, classes.skeleton)} />
      </span>
    );
  }

  if (isError || !health) {
    return (
      <span
        className={classNames(classes.root, className)}
        aria-label="Health score unavailable"
      >
        <span className={classes.score} aria-hidden="true">
          —
        </span>
        <span className={classes.bar} aria-hidden="true" />
      </span>
    );
  }

  const { score, band, factors, critical_factor_count } = health;
  const fillWidth = `${Math.max(0, Math.min(100, score))}%`;
  const ariaLabel = `Health score ${score} out of 100, ${BAND_LABEL[band]}${
    critical_factor_count > 0
      ? `, ${critical_factor_count} critical factor${
          critical_factor_count > 1 ? "s" : ""
        }`
      : ""
  }.`;

  const tooltipMessage = <FactorBreakdown factors={factors} />;

  return (
    <Tooltip
      message={tooltipMessage}
      position="top-center"
      tooltipClassName={classes.tooltip}
    >
      <span
        className={classNames(classes.root, className)}
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        aria-valuetext={ariaLabel}
        aria-label={ariaLabel}
        tabIndex={0}
      >
        <span className={classes.score}>{score}</span>
        <span className={classes.bar}>
          <span
            className={classNames(classes.fill, BAND_FILL_CLASS[band])}
            style={{ width: fillWidth }}
            aria-hidden="true"
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
    </Tooltip>
  );
};

export default HealthBar;
