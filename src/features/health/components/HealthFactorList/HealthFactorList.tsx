import { Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import type { HealthFactor } from "../../types";
import classes from "./HealthFactorList.module.scss";

// Critical factors have weight ≥ 100 (drives the score to 0 on a single
// match — see LA061 spec's "MVP algorithm"). Knowing the threshold here
// lets us tag rows visually without an extra round-trip to look up the
// originating rule.
const CRITICAL_THRESHOLD = 100;

export interface HealthFactorListProps {
  readonly factors: HealthFactor[];
  readonly className?: string;
  readonly emptyMessage?: string;
}

const HealthFactorList: FC<HealthFactorListProps> = ({
  factors,
  className,
  emptyMessage = "No detractors — fully healthy.",
}) => {
  if (factors.length === 0) {
    return (
      <div className={classNames(classes.empty, className)}>
        <Icon name="success" />
        <span>{emptyMessage}</span>
      </div>
    );
  }

  return (
    <ul className={classNames(classes.list, className)}>
      {factors.map((factor) => {
        const isCritical = factor.points >= CRITICAL_THRESHOLD;
        return (
          <li
            key={factor.rule_id}
            className={classNames(classes.row, {
              [classes.rowCritical]: isCritical,
            })}
          >
            <span className={classes.icon} aria-hidden="true">
              <Icon name={isCritical ? "error" : "warning"} />
            </span>
            <span className={classes.description}>
              {factor.description || factor.rule_key}
            </span>
            <span className={classes.points}>−{factor.points}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default HealthFactorList;
