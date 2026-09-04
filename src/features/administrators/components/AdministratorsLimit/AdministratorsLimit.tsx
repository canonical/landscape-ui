import type { FC } from "react";
import classes from "./AdministratorsLimit.module.scss";

interface AdministratorsLimitProps {
  readonly administratorsCount: number;
  readonly administratorsLimit: number;
}

const AdministratorsLimit: FC<AdministratorsLimitProps> = ({
  administratorsCount,
  administratorsLimit,
}) => {
  const adminValues =
    administratorsLimit === 0
      ? {
          limit: "Unable to determine",
          count: "Unable to determine",
        }
      : {
          limit: administratorsLimit,
          count: administratorsLimit - administratorsCount,
        };

  return (
    <div className={classes.limitInfo}>
      <div className={classes.limitItem}>
        <span className="u-text--muted">Maximum administrators</span>
        <span>{adminValues.limit}</span>
      </div>
      <div className={classes.limitItem}>
        <span className="u-text--muted">Remaining administrators</span>
        <span>{adminValues.count}</span>
      </div>
    </div>
  );
};

export default AdministratorsLimit;
