import type { FC } from "react";
import { lazy, Suspense } from "react";
import classes from "./AlertCard.module.scss";
import classNames from "classnames";
import useInstances from "@/hooks/useInstances";
import { Link } from "react-router";
import type { Status } from "@/features/instances";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon } from "@canonical/react-components";
import { pluralize } from "@/utils/_helpers";

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
      query: query,
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
  const alertCount =
    getAlertsQueryResult?.data.count ||
    getPendingInstancesQueryResult?.data.length ||
    0;
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
          {isPendingComputersAlert && alertCount > 0 && (
            <Button
              type="button"
              appearance="link"
              className={classNames("u-no-margin u-no-padding", classes.link)}
              onClick={handlePendingInstancesReview}
            >
              <span className={classes.instancesNumber}>{alertCount}</span>{" "}
              {pluralize(alertCount, "instance")}
            </Button>
          )}

          {!isPendingComputersAlert && alertCount > 0 && (
            <Link
              className={classNames("u-no-margin u-no-padding", classes.link)}
              to={`/instances?status=${filterValue}`}
            >
              <span className={classes.instancesNumber}>{alertCount}</span>{" "}
              {pluralize(alertCount, "instance")}
            </Link>
          )}

          {alertCount === 0 && (
            <span
              className={classNames(
                "u-no-margin u-no-padding u-text--muted",
                classes.link,
              )}
            >
              <span className={classes.instancesNumber}>{alertCount}</span>{" "}
              instances
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default AlertCard;
