import { FC, ReactNode } from "react";
import classes from "./AlertCard.module.scss";
import classNames from "classnames";
import useInstances from "@/hooks/useInstances";
import { Link } from "react-router-dom";
import { ROOT_PATH } from "@/constants";
import useDebug from "@/hooks/useDebug";
import { QUERY_STATUSES } from "@/pages/dashboard/instances/InstancesContainer/constants";
import LoadingState from "@/components/layout/LoadingState";

interface AlertCardProps {
  alertQueryData: {
    label: string;
    filterValue: string;
    icon: ReactNode;
  };
}

const AlertCard: FC<AlertCardProps> = ({ alertQueryData }) => {
  const { getInstancesQuery } = useInstances();
  const debug = useDebug();

  const {
    data: alertsData,
    isLoading,
    error,
    isError,
  } = getInstancesQuery({
    query: QUERY_STATUSES[alertQueryData.filterValue],
    limit: 1,
    root_only: false,
  });

  if (error) {
    debug(error);
  }

  return (
    <div className={classes.container}>
      <div className={classes.title}>
        {alertQueryData.icon}
        <p className="p-heading--5 u-no-padding u-no-margin">
          {alertQueryData.label}
        </p>
      </div>
      {isLoading && <LoadingState />}
      {!isLoading && isError && (
        <p className="u-no-margin--bottom">Error loading data.</p>
      )}
      {!isLoading && !isError && (
        <Link
          className={classNames("u-no-margin u-no-padding", classes.link)}
          to={`${ROOT_PATH}instances?status=${alertQueryData.filterValue}`}
        >
          <span className={classes.instancesNumber}>
            {alertsData.data.count}
          </span>{" "}
          instance
          {alertsData.data.count === 1 ? "" : "s"}
        </Link>
      )}
    </div>
  );
};

export default AlertCard;
