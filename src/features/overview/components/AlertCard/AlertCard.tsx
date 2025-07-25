import type { FC } from "react";
import { lazy, Suspense } from "react";
import classes from "./AlertCard.module.scss";
import useInstances from "@/hooks/useInstances";
import type { Status } from "@/features/instances";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Icon } from "@canonical/react-components";
import EmptyAlertCount from "./components/EmptyAlertCount";
import AlertLink from "./components/AlertLink";

const PendingInstancesForm = lazy(
  () => import("@/pages/dashboard/instances/PendingInstancesForm"),
);

const AlertCard: FC<Status> = ({
  alertType,
  filterValue,
  icon,
  alternateLabel,
  label,
  query,
}) => {
  const { getInstancesQuery, getPendingInstancesQuery } = useInstances();
  const { setSidePanelContent } = useSidePanel();

  const isPendingComputersAlert = alertType === "PendingComputersAlert";

  const {
    data: getAlertsQueryResult,
    isLoading: getAlertsQueryLoading,
    isError: getAlertsQueryError,
  } = getInstancesQuery(
    {
      query,
      limit: 1,
      root_only: false,
    },
    {
      enabled: !isPendingComputersAlert,
    },
  );

  const {
    data: getPendingInstancesQueryResult,
    isLoading: getPendingInstancesQueryLoading,
    error: getPendingInstancesQueryError,
  } = getPendingInstancesQuery(undefined, {
    enabled: isPendingComputersAlert,
  });

  const alertData =
    getAlertsQueryResult?.data.results ||
    getPendingInstancesQueryResult?.data ||
    [];

  const alertCount = Number(
    isPendingComputersAlert
      ? getPendingInstancesQueryResult?.data.length
      : getAlertsQueryResult?.data.count,
  );

  const isLoading = getAlertsQueryLoading || getPendingInstancesQueryLoading;
  const isError = getAlertsQueryError || getPendingInstancesQueryError;

  const handlePendingInstancesReview = () => {
    setSidePanelContent(
      "Review Pending Instances",
      <Suspense fallback={<LoadingState />}>
        <PendingInstancesForm
          instances={getPendingInstancesQueryResult?.data ?? []}
        />
      </Suspense>,
      "large",
    );
  };

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
                  : `/instances?status=${filterValue}`
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
