import { Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { CRITICAL_FACTOR_POINTS } from "../../helpers";
import type { HealthFactor } from "../../types";
import classes from "./HealthFactorList.module.scss";

export interface HealthFactorListProps {
  readonly factors: HealthFactor[];
  readonly className?: string;
  readonly emptyMessage?: string;
}

const HealthFactorList: FC<HealthFactorListProps> = ({
  factors,
  className,
  emptyMessage = "Nothing is lowering this instance's score right now.",
}) => {
  if (factors.length === 0) {
    return (
      <p className={classNames(classes.empty, className)}>
        <Icon name="success" />
        <span>{emptyMessage}</span>
      </p>
    );
  }

  return (
    <ul className={classNames(classes.list, className)}>
      {factors.map((factor) => {
        const isCritical = factor.points >= CRITICAL_FACTOR_POINTS;
        return (
          <li key={factor.rule_id} className={classes.item}>
            <Icon
              name={isCritical ? "error" : "warning"}
              aria-label={isCritical ? "Critical" : "Warning"}
            />
            <span className={classes.description}>
              {factor.description || factor.rule_key}
            </span>
            <span className={classes.points}>
              {isCritical ? (
                <strong>Sets score to 0</strong>
              ) : (
                <>
                  <strong>−{factor.points}</strong> points
                </>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default HealthFactorList;
