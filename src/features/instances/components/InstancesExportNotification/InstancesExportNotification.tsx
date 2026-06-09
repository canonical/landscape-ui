import { useGetInstancesExportJobs } from "../../api";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Notification } from "@canonical/react-components";
import { lazy, Suspense, useEffect, useMemo, useRef, type FC } from "react";
import { useBoolean } from "usehooks-ts";
import classes from "./InstancesExportNotification.module.scss";

const InstancesExportDetailsPanel = lazy(
  async () => import("../InstancesExportDetailsPanel"),
);

const InstancesExportNotification: FC = () => {
  const { setSidePanelContent } = useSidePanel();
  const { exportJobs, processingExportJobsCount, readyExportJobsCount } =
    useGetInstancesExportJobs();
  const previousJobsCountRef = useRef(exportJobs.length);
  const { value: dismissed, setFalse: show, setTrue: dismiss } = useBoolean();

  useEffect(() => {
    if (exportJobs.length > previousJobsCountRef.current) {
      show();
    }

    previousJobsCountRef.current = exportJobs.length;
  }, [exportJobs.length, show]);

  const message = useMemo(() => {
    if (processingExportJobsCount && readyExportJobsCount) {
      return `You have ${processingExportJobsCount} TSV export${processingExportJobsCount === 1 ? "" : "s"} in progress and ${readyExportJobsCount} ready to download.`;
    }

    if (processingExportJobsCount) {
      return `Your TSV export${processingExportJobsCount === 1 ? " is" : "s are"} being generated.`;
    }

    return `Your TSV export${readyExportJobsCount === 1 ? " is" : "s are"} ready to download.`;
  }, [processingExportJobsCount, readyExportJobsCount]);

  if (!exportJobs.length || dismissed) {
    return null;
  }

  return (
    <Notification
      severity="information"
      title="TSV exports"
      className={classes.notification}
      onDismiss={dismiss}
    >
      <span>{message} </span>
      <Button
        type="button"
        appearance="link"
        onClick={() => {
          setSidePanelContent(
            "TSV exports",
            <Suspense fallback={<LoadingState />}>
              <InstancesExportDetailsPanel />
            </Suspense>,
            "large",
          );
        }}
      >
        View export details
      </Button>
    </Notification>
  );
};

export default InstancesExportNotification;
