import moment from "moment";
import { FC } from "react";
import { Button, Col, Icon, Row } from "@canonical/react-components";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { ACTIVITY_STATUSES } from "@/features/activities/constants";
import { useActivities } from "@/features/activities/hooks";
import { Activity } from "@/features/activities/types";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useSidePanel from "@/hooks/useSidePanel";
import classes from "./ActivityDetails.module.scss";

interface ActivityDetailsProps {
  activityId: number;
}

const ActivityDetails: FC<ActivityDetailsProps> = ({ activityId }) => {
  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { closeSidePanel } = useSidePanel();

  const {
    approveActivitiesQuery,
    cancelActivitiesQuery,
    getSingleActivityQuery,
    redoActivitiesQuery,
    undoActivitiesQuery,
  } = useActivities();
  const { getInstancesQuery } = useInstances();

  const {
    mutateAsync: approveActivities,
    isLoading: approveActivitiesLoading,
  } = approveActivitiesQuery;
  const { mutateAsync: cancelActivities, isLoading: cancelActivitiesLoading } =
    cancelActivitiesQuery;
  const { mutateAsync: redoActivities, isLoading: redoActivitiesLoading } =
    redoActivitiesQuery;
  const { mutateAsync: undoActivities, isLoading: undoActivitiesLoading } =
    undoActivitiesQuery;

  const {
    data: getSingleActivityQueryResult,
    error: getSingleActivityQueryError,
    isLoading: getSingleActivityQueryLoading,
  } = getSingleActivityQuery({ activityId });

  if (getSingleActivityQueryError) {
    debug(getSingleActivityQueryError);
  }

  const activity = getSingleActivityQueryResult?.data;

  const { data: getInstancesQueryResult, error: getInstancesQueryError } =
    getInstancesQuery(
      {
        query: `id:${activity?.computer_id}`,
        root_only: false,
      },
      {
        enabled: !!activity?.computer_id,
      },
    );

  if (getInstancesQueryError) {
    debug(getInstancesQueryError);
  }

  const instanceTitle =
    getInstancesQueryResult && getInstancesQueryResult.data.results.length > 0
      ? getInstancesQueryResult.data.results[0].title
      : "";

  const handleApproveActivities = async (activity: Activity) => {
    try {
      await approveActivities({ query: `id:${activity.id}` });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleApproveActivitiesDialog = (activity: Activity) => {
    confirmModal({
      title: "Approve activity",
      body: `Are you sure you want to approve ${activity.summary} activity?`,
      buttons: [
        <Button
          key="approve"
          appearance="positive"
          onClick={() => handleApproveActivities(activity)}
        >
          Approve
        </Button>,
      ],
    });
  };

  const handleCancelActivities = async (activity: Activity) => {
    try {
      await cancelActivities({ query: `id:${activity.id}` });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleCancelActivitiesDialog = (activity: Activity) => {
    confirmModal({
      title: "Cancel activity",
      body: `Are you sure you want to cancel ${activity.summary} activity?`,
      buttons: [
        <Button
          key="cancel"
          appearance="positive"
          onClick={() => handleCancelActivities(activity)}
        >
          Apply
        </Button>,
      ],
    });
  };

  const handleRedoActivities = async (activity: Activity) => {
    try {
      await redoActivities({ activityIds: [activity.id] });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRedoActivitiesDialog = (activity: Activity) => {
    confirmModal({
      title: "Redo activity",
      body: `Are you sure you want to redo ${activity.summary} activity?`,
      buttons: [
        <Button
          key="redo"
          appearance="positive"
          onClick={() => handleRedoActivities(activity)}
        >
          Redo
        </Button>,
      ],
    });
  };

  const handleUndoActivities = async (activity: Activity) => {
    try {
      await undoActivities({ activityIds: [activity.id] });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleUndoActivitiesDialog = (activity: Activity) => {
    confirmModal({
      title: "Undo activity",
      body: `Are you sure you want to undo ${activity.summary} activity?`,
      buttons: [
        <Button
          key="undo"
          appearance="positive"
          onClick={() => handleUndoActivities(activity)}
        >
          Undo
        </Button>,
      ],
    });
  };

  return (
    <>
      {getSingleActivityQueryLoading && <LoadingState />}
      {!getSingleActivityQueryLoading && activity && (
        <>
          <div key="buttons" className="p-segmented-control">
            <div className="p-segmented-control__list">
              <Button
                className="p-segmented-control__button"
                type="button"
                onClick={() => handleApproveActivitiesDialog(activity)}
                disabled={approveActivitiesLoading}
              >
                Approve
              </Button>
              <Button
                className="p-segmented-control__button"
                type="button"
                onClick={() => handleCancelActivitiesDialog(activity)}
                disabled={cancelActivitiesLoading}
              >
                Cancel
              </Button>
              <Button
                className="p-segmented-control__button"
                type="button"
                onClick={() => handleUndoActivitiesDialog(activity)}
                disabled={undoActivitiesLoading}
              >
                Undo
              </Button>
              <Button
                className="p-segmented-control__button"
                type="button"
                onClick={() => handleRedoActivitiesDialog(activity)}
                disabled={redoActivitiesLoading}
              >
                Redo
              </Button>
            </div>
          </div>
          <Row className="u-no-padding--left u-no-padding--right">
            <Col size={12}>
              <InfoItem label="Description" value={activity.summary} />
            </Col>
            {instanceTitle && (
              <Col size={12}>
                <InfoItem label="Instance" value={instanceTitle} />
              </Col>
            )}
            <Col size={6}>
              <InfoItem
                label="Status"
                value={
                  <>
                    <Icon
                      name={ACTIVITY_STATUSES[activity.activity_status].icon}
                      className={classes.statusIcon}
                    />
                    <span>
                      {ACTIVITY_STATUSES[activity.activity_status].label}
                    </span>
                  </>
                }
              />
            </Col>
            <Col size={6}>
              <InfoItem
                label="Created at"
                value={moment(activity.creation_time).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )}
              />
            </Col>
            {typeof activity.delivery_time === "string" && (
              <Col size={6}>
                <InfoItem
                  label="Delivered at"
                  value={moment(activity.delivery_time).format(
                    DISPLAY_DATE_TIME_FORMAT,
                  )}
                />
              </Col>
            )}
            {activity.completion_time && (
              <Col size={6}>
                <InfoItem
                  label="Completed at"
                  value={moment(activity.completion_time).format(
                    DISPLAY_DATE_TIME_FORMAT,
                  )}
                />
              </Col>
            )}
            {activity.result_text && (
              <Col size={12}>
                <InfoItem
                  label="Output"
                  value={activity.result_text}
                  className={classes.output}
                />
              </Col>
            )}
          </Row>
        </>
      )}

      <div className="form-buttons">
        <Button
          type="button"
          onClick={closeSidePanel}
          className="u-no-margin--bottom"
        >
          Close
        </Button>
      </div>
    </>
  );
};

export default ActivityDetails;
