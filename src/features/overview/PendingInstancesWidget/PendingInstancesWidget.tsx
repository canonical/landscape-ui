import classNames from "classnames";
import { FC, lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useSidePanel from "@/hooks/useSidePanel";
import classes from "./PendingInstancesWidget.module.scss";

const PendingInstancesForm = lazy(
  () => import("@/pages/dashboard/instances/PendingInstancesForm"),
);

const PendingInstancesWidget: FC = () => {
  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const { getPendingInstancesQuery } = useInstances();

  const {
    data: getPendingInstancesQueryResult,
    error: getPendingInstancesQueryError,
    isLoading: getPendingInstancesQueryLoading,
  } = getPendingInstancesQuery();

  if (getPendingInstancesQueryError) {
    debug(getPendingInstancesQueryError);
  }

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
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.5 3.02393H4V12.9917H5.5V3.02393ZM11.5 3.02393H10V12.9917H11.5V3.02393Z"
            fill="#24598F"
          />
        </svg>
        <p className="p-heading--5 u-no-padding u-no-margin">
          Pending computers
        </p>
      </div>
      {getPendingInstancesQueryLoading && <LoadingState />}
      {!getPendingInstancesQueryLoading && !!getPendingInstancesQueryError && (
        <p className="u-no-margin--bottom">Error loading data.</p>
      )}
      {!getPendingInstancesQueryLoading && !getPendingInstancesQueryError && (
        <Button
          type="button"
          appearance="link"
          className={classNames("u-no-margin u-no-padding", classes.link)}
          onClick={handlePendingInstancesReview}
          disabled={!getPendingInstancesQueryResult?.data.length}
        >
          <span className={classes.instancesNumber}>
            {getPendingInstancesQueryResult?.data.length}
          </span>{" "}
          {getPendingInstancesQueryResult?.data.length !== 1
            ? "instances"
            : "instance"}
        </Button>
      )}
    </div>
  );
};

export default PendingInstancesWidget;
