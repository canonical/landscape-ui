import moment from "moment";
import type { FC } from "react";
import {
  Col,
  ConfirmationButton,
  Icon,
  Row,
} from "@canonical/react-components";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { ACTIVITY_STATUSES } from "../../constants";
import { useActivities } from "../../hooks";
import type { Activity } from "../../types";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import classes from "./ActivityDetails.module.scss";

interface ActivityDetailsProps {
  readonly activityId: number;
}

const ActivityDetails: FC<ActivityDetailsProps> = ({ activityId }) => {
  const debug = useDebug();

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
    isPending: approveActivitiesLoading,
  } = approveActivitiesQuery;
  const { mutateAsync: cancelActivities, isPending: cancelActivitiesLoading } =
    cancelActivitiesQuery;
  const { mutateAsync: redoActivities, isPending: redoActivitiesLoading } =
    redoActivitiesQuery;
  const { mutateAsync: undoActivities, isPending: undoActivitiesLoading } =
    undoActivitiesQuery;

  const {
    data: getSingleActivityQueryResult,
    isLoading: getSingleActivityQueryLoading,
  } = getSingleActivityQuery({ activityId });

  const activity = getSingleActivityQueryResult?.data;

  const { data: getInstancesQueryResult } = getInstancesQuery(
    {
      query: `id:${activity?.computer_id}`,
      root_only: false,
    },
    {
      enabled: !!activity?.computer_id,
    },
  );

  const instanceTitle =
    getInstancesQueryResult && getInstancesQueryResult.data.results.length > 0
      ? getInstancesQueryResult.data.results[0].title
      : "";

  const handleApproveActivity = async (a: Activity) => {
    try {
      await approveActivities({ query: `id:${a.id}` });
    } catch (error) {
      debug(error);
    }
  };

  const handleCancelActivity = async (a: Activity) => {
    try {
      await cancelActivities({ query: `id:${a.id}` });
    } catch (error) {
      debug(error);
    }
  };

  const handleRedoActivity = async (a: Activity) => {
    try {
      await redoActivities({ activity_ids: [a.id] });
    } catch (error) {
      debug(error);
    }
  };

  const handleUndoActivity = async (a: Activity) => {
    try {
      await undoActivities({ activity_ids: [a.id] });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <>
      {getSingleActivityQueryLoading && <LoadingState />}
      {!getSingleActivityQueryLoading && activity && (
        <>
          <div key="buttons" className="p-segmented-control">
            <div className="p-segmented-control__list">
              {activity.actions?.approvable && (
                <ConfirmationButton
                  className="p-segmented-control__button"
                  type="button"
                  disabled={approveActivitiesLoading}
                  confirmationModalProps={{
                    title: "Approve activity",
                    children: (
                      <p>
                        Are you sure you want to approve {activity.summary}{" "}
                        activity?
                      </p>
                    ),
                    confirmButtonLabel: "Approve",
                    confirmButtonAppearance: "positive",
                    confirmButtonDisabled: approveActivitiesLoading,
                    confirmButtonLoading: approveActivitiesLoading,
                    onConfirm: async () => handleApproveActivity(activity),
                  }}
                >
                  Approve
                </ConfirmationButton>
              )}
              {activity.actions?.cancelable && (
                <ConfirmationButton
                  className="p-segmented-control__button"
                  type="button"
                  disabled={cancelActivitiesLoading}
                  confirmationModalProps={{
                    title: "Cancel activity",
                    children: (
                      <p>
                        Are you sure you want to cancel {activity.summary}{" "}
                        activity?
                      </p>
                    ),
                    confirmButtonLabel: "Apply",
                    confirmButtonAppearance: "positive",
                    confirmButtonDisabled: cancelActivitiesLoading,
                    confirmButtonLoading: cancelActivitiesLoading,
                    onConfirm: async () => handleCancelActivity(activity),
                  }}
                >
                  {!activity.actions?.approvable &&
                  !activity.actions?.reappliable &&
                  !activity.actions?.revertable
                    ? "Cancel activity"
                    : "Cancel"}
                </ConfirmationButton>
              )}
              {activity.actions?.revertable && (
                <ConfirmationButton
                  className="p-segmented-control__button"
                  type="button"
                  disabled={undoActivitiesLoading}
                  confirmationModalProps={{
                    title: "Undo activity",
                    children: (
                      <p>
                        Are you sure you want to undo {activity.summary}{" "}
                        activity?
                      </p>
                    ),
                    confirmButtonLabel: "Undo",
                    confirmButtonAppearance: "positive",
                    confirmButtonDisabled: undoActivitiesLoading,
                    confirmButtonLoading: undoActivitiesLoading,
                    onConfirm: async () => handleUndoActivity(activity),
                  }}
                >
                  Undo
                </ConfirmationButton>
              )}
              {activity.actions?.reappliable && (
                <ConfirmationButton
                  className="p-segmented-control__button"
                  type="button"
                  disabled={redoActivitiesLoading}
                  confirmationModalProps={{
                    title: "Redo activity",
                    children: (
                      <p>
                        Are you sure you want to redo {activity.summary}{" "}
                        activity?
                      </p>
                    ),
                    confirmButtonLabel: "Redo",
                    confirmButtonAppearance: "positive",
                    confirmButtonDisabled: redoActivitiesLoading,
                    confirmButtonLoading: redoActivitiesLoading,
                    onConfirm: async () => handleRedoActivity(activity),
                  }}
                >
                  Redo
                </ConfirmationButton>
              )}
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
                  type="snippet"
                  value={activity.result_text}
                  className={classes.output}
                />
              </Col>
            )}
          </Row>
        </>
      )}
    </>
  );
};

export default ActivityDetails;
