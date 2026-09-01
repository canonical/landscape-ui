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
  return (
    <div className={classes.limitInfo}>
      <div className={classes.limitItem}>
        <span className="u-text--muted">Maximum administrators</span>
        <span>{administratorsLimit}</span>
      </div>
      <div className={classes.limitItem}>
        <span className="u-text--muted">Remaining administrators</span>
        <span>{administratorsLimit - administratorsCount}</span>
      </div>
    </div>
  );
};

export default AdministratorsLimit;
