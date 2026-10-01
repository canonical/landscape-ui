import type { FC } from "react";
import classes from "./AdministratorsLimit.module.scss";

interface AdministratorsLimitProps {
  readonly adminAndInviteCount: number;
  readonly administratorsLimit: number;
  readonly isAdminInfoError?: boolean;
}

const AdministratorsLimit: FC<AdministratorsLimitProps> = ({
  adminAndInviteCount,
  administratorsLimit,
  isAdminInfoError = false,
}) => {
  const adminValues = isAdminInfoError
    ? {
        limit: !administratorsLimit
          ? "Unable to determine"
          : administratorsLimit,
        remaining: "Unable to determine",
      }
    : {
        limit: administratorsLimit,
        remaining: administratorsLimit - adminAndInviteCount,
      };

  return (
    <div className={classes.limitInfo}>
      <div className={classes.limitItem}>
        <span className="u-text--muted">Maximum administrators</span>
        <span>{adminValues.limit}</span>
      </div>
      <div className={classes.limitItem}>
        <span className="u-text--muted">Remaining invitations</span>
        <span>{adminValues.remaining}</span>
      </div>
    </div>
  );
};

export default AdministratorsLimit;
