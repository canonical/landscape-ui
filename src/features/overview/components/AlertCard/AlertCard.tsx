import LoadingState from "@/components/layout/LoadingState";
import {
  useGetInstances,
  useGetPendingInstances,
  type Status,
} from "@/features/instances";
import usePageParams from "@/hooks/usePageParams";
import { Icon } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./AlertCard.module.scss";
import AlertLink from "./components/AlertLink";
import EmptyAlertCount from "./components/EmptyAlertCount";
import { ROUTES } from "@/libs/routes";

const AlertCard: FC<Status> = ({
  alertType,
  filterValue,
  icon,
  alternateLabel,
  label,
  query,
}) => {
  const { createSidePathPusher } = usePageParams();

  const isPendingComputersAlert = alertType === "PendingComputersAlert";

  const {
    instances: instancesWithAlert,
    instancesCount: instancesWithAlertCount,
    isGettingInstances: isGettingInstancesWithAlert,
    isErrorInstances: isErrorInstancesWithAlert,
  } = useGetInstances(
    {
      query,
      limit: 1,
    },
    undefined,
    {
      enabled: !isPendingComputersAlert,
    },
  );

  const { pendingInstances, isGettingPendingInstances, pendingInstancesError } =
    useGetPendingInstances(undefined, {
      enabled: isPendingComputersAlert,
    });

  const alertData = isPendingComputersAlert
    ? pendingInstances
    : instancesWithAlert;
  const alertCount = Number(
    isPendingComputersAlert ? pendingInstances.length : instancesWithAlertCount,
  );
  const isLoading = isPendingComputersAlert
    ? isGettingPendingInstances
    : isGettingInstancesWithAlert;
  const isError = isPendingComputersAlert
    ? pendingInstancesError
    : isErrorInstancesWithAlert;

  const handlePendingInstancesReview = createSidePathPusher("review-pending-instances");

  return (
    <div className={classes.container}>
      <div className={classes.title}>
        <Icon name={icon.gray ?? ""} className={classes.icon} />
        <p className="p-heading--5 u-no-padding u-no-margin">
          {alternateLabel ?? label}
        </p>
      </div>

      {isLoading && <LoadingState />}

      {!isLoading && isError && (
        <p className="u-no-margin--bottom">Error loading data.</p>
      )}

      {alertData && !isLoading && !isError && (
        <>
          {alertCount > 0 ? (
            <AlertLink
              count={alertCount}
              onClick={
                isPendingComputersAlert
                  ? handlePendingInstancesReview
                  : undefined
              }
              to={
                isPendingComputersAlert
                  ? undefined
                  : ROUTES.instances.root({ status: filterValue })
              }
            />
          ) : (
            <EmptyAlertCount />
          )}
        </>
      )}
    </div>
  );
};

export default AlertCard;
