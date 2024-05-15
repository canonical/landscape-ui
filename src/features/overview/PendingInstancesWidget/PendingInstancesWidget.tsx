import classNames from "classnames";
import { FC, lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useInstances from "@/hooks/useInstances";
import useSidePanel from "@/hooks/useSidePanel";
import classes from "./PendingInstancesWidget.module.scss";
import { STATUSES } from "@/pages/dashboard/instances/InstanceList/constants";

const PendingInstancesForm = lazy(
  () => import("@/pages/dashboard/instances/PendingInstancesForm"),
);

const PendingInstancesWidget: FC = () => {
  const { setSidePanelContent } = useSidePanel();
  const { getPendingInstancesQuery } = useInstances();

  const {
    data: getPendingInstancesQueryResult,
    error: getPendingInstancesQueryError,
    isLoading: getPendingInstancesQueryLoading,
  } = getPendingInstancesQuery();

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
        <i className={`p-icon--${STATUSES.PendingComputers.icon.gray}`} />
        <p className="p-heading--5 u-no-padding u-no-margin">
          {STATUSES.PendingComputers.label}
        </p>
      </div>
      {getPendingInstancesQueryLoading && <LoadingState />}
      {!getPendingInstancesQueryLoading && !!getPendingInstancesQueryError && (
        <p className="u-no-margin--bottom">Error loading data.</p>
      )}
      {!getPendingInstancesQueryLoading && !getPendingInstancesQueryError && (
        <>
          {getPendingInstancesQueryResult?.data.length > 0 ? (
            <Button
              type="button"
              appearance="link"
              className={classNames("u-no-margin u-no-padding", classes.link)}
              onClick={handlePendingInstancesReview}
            >
              <span className={classes.instancesNumber}>
                {getPendingInstancesQueryResult?.data.length}
              </span>{" "}
              {getPendingInstancesQueryResult?.data.length !== 1
                ? "instances"
                : "instance"}
            </Button>
          ) : (
            <span
              className={classNames(
                "u-no-margin u-no-padding u-text--muted",
                classes.link,
              )}
            >
              <span className={classes.instancesNumber}>
                {getPendingInstancesQueryResult?.data.length}
              </span>{" "}
              instances
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default PendingInstancesWidget;
