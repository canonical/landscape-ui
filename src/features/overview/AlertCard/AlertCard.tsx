import { FC } from "react";
import classes from "./AlertCard.module.scss";
import classNames from "classnames";
import useInstances from "@/hooks/useInstances";
import { Link } from "react-router-dom";
import { ROOT_PATH } from "@/constants";
import { QUERY_STATUSES } from "@/pages/dashboard/instances/InstancesContainer/constants";
import LoadingState from "@/components/layout/LoadingState";
import { Status } from "@/pages/dashboard/instances/InstanceList/constants";

const AlertCard: FC<Status> = ({
  filterValue,
  icon,
  alternateLabel,
  label,
}) => {
  const { getInstancesQuery } = useInstances();

  const {
    data: alertsData,
    isLoading,
    isError,
  } = getInstancesQuery({
    query: QUERY_STATUSES[filterValue],
    limit: 1,
    root_only: false,
  });

  return (
    <div className={classes.container}>
      <div className={classes.title}>
        <i className={`p-icon--${icon.gray}`} />
        <p className="p-heading--5 u-no-padding u-no-margin">
          {alternateLabel ?? label}
        </p>
      </div>
      {isLoading && <LoadingState />}
      {!isLoading && isError && (
        <p className="u-no-margin--bottom">Error loading data.</p>
      )}
      {!isLoading && !isError && (
        <>
          {alertsData.data.count > 0 ? (
            <>
              <Link
                className={classNames("u-no-margin u-no-padding", classes.link)}
                to={`${ROOT_PATH}instances?status=${filterValue}`}
              >
                <span className={classes.instancesNumber}>
                  {alertsData.data.count}
                </span>{" "}
                {alertsData.data.count === 1 ? "instance" : "instances"}
              </Link>
            </>
          ) : (
            <>
              <span
                className={classNames(
                  "u-no-margin u-no-padding u-text--muted",
                  classes.link,
                )}
              >
                <span className={classes.instancesNumber}>
                  {alertsData.data.count}
                </span>{" "}
                instances
              </span>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AlertCard;
