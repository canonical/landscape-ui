import classNames from "classnames";
import moment from "moment";
import { FC, lazy, Suspense, useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Button, Icon } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT, NOT_AVAILABLE } from "@/constants";
import { ACTIVITY_STATUSES } from "@/features/activities";
import useSidePanel from "@/hooks/useSidePanel";
import { SyncPocketRef } from "@/pages/dashboard/repositories/mirrors/types";
import { Pocket } from "@/types/Pocket";
import { getLastSyncStatusIcon } from "./helpers";
import classes from "./PocketSyncActivity.module.scss";

const ActivityDetails = lazy(() =>
  import("@/features/activities").then((module) => ({
    default: module.ActivityDetails,
  })),
);

interface PocketSyncActivityProps {
  pocket: Pocket;
  syncPocketRefAdd: (ref: SyncPocketRef) => void;
  syncPocketRefs: SyncPocketRef[];
}

const PocketSyncActivity: FC<PocketSyncActivityProps> = ({
  pocket,
  syncPocketRefAdd,
  syncPocketRefs,
}) => {
  const isLargerScreen = useMediaQuery("(min-width: 620px)");
  const { setSidePanelContent } = useSidePanel();

  useEffect(() => {
    if (
      (pocket.mode !== "mirror" && pocket.mode !== "pull") ||
      !pocket.last_sync_status ||
      pocket.last_sync_status !== "in progress"
    ) {
      return;
    }

    const syncPocket = syncPocketRefs.find(
      ({ distributionName }) => distributionName === pocket.distribution.name,
    );

    if (syncPocket) {
      return;
    }

    syncPocketRefAdd({
      distributionName: pocket.distribution.name,
      seriesName: pocket.series.name,
      pocketName: pocket.name,
    });
  }, [pocket, syncPocketRefs]);

  if (pocket.mode === "upload") {
    return NOT_AVAILABLE;
  }

  if (!pocket.last_sync_status) {
    return <NoData />;
  }

  if (pocket.last_sync_status === "synced") {
    return moment(pocket.last_sync_time).format(DISPLAY_DATE_TIME_FORMAT);
  }

  if (pocket.last_sync_status === "in progress") {
    return (
      <div className={classes.progressContainer}>
        {isLargerScreen && (
          <div className={classes.progressBarContainer}>
            <div
              className={classes.progressBar}
              style={{
                width: `${pocket.last_sync_activity.progress}%`,
              }}
            />
          </div>
        )}
        <span
          className={classes.progress}
        >{`${pocket.last_sync_activity.progress}%`}</span>
      </div>
    );
  }

  const key =
    pocket.last_sync_status === "queued"
      ? "undelivered"
      : pocket.last_sync_status;

  const handleActivityClick = () => {
    setSidePanelContent(
      pocket.last_sync_activity.summary,
      <Suspense fallback={<LoadingState />}>
        <ActivityDetails activityId={pocket.last_sync_activity.id} />
      </Suspense>,
    );
  };

  return (
    <div
      className={classNames(
        "p-table__cell--icon-placeholder",
        classes.iconContainer,
      )}
    >
      <Icon name={getLastSyncStatusIcon(pocket.last_sync_status)} />
      <Button
        type="button"
        appearance="link"
        className="u-no-margin--bottom u-no-padding--top"
        onClick={handleActivityClick}
      >
        {ACTIVITY_STATUSES[key].label}
      </Button>
    </div>
  );
};

export default PocketSyncActivity;
