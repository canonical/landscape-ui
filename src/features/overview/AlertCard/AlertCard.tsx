import { FC, ReactNode } from "react";
import classes from "./AlertCard.module.scss";
import classNames from "classnames";
import useInstances from "@/hooks/useInstances";
import { useNavigate } from "react-router-dom";
import { ROOT_PATH } from "@/constants";
import useDebug from "@/hooks/useDebug";
import { QUERY_STATUSES } from "@/pages/dashboard/instances/InstancesContainer/constants";
import LoadingState from "@/components/layout/LoadingState";
import { Button } from "@canonical/react-components";

interface AlertCardProps {
  alertQueryData: {
    label: string;
    filterValue: string;
    icon: ReactNode;
  };
}

const AlertCard: FC<AlertCardProps> = ({ alertQueryData }) => {
  const { getInstancesQuery } = useInstances();
  const navigate = useNavigate();
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

  const handleAlertClick = () => {
    navigate(`${ROOT_PATH}instances?status=${alertQueryData.filterValue}`);
  };

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
        <Button
          appearance="link"
          disabled={!alertsData.data.count}
          onClick={handleAlertClick}
          className={classNames("u-no-margin u-no-padding", classes.link)}
        >
          <span className={classes.instancesNumber}>
            {alertsData.data.count}
          </span>{" "}
          instance
          {alertsData.data.count === 1 ? "" : "s"}
        </Button>
      )}
    </div>
  );
};

export default AlertCard;
