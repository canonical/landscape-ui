import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import StaticLink from "@/components/layout/StaticLink";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useGetInstance } from "@/features/instances";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import {
  CodeSnippet,
  ConfirmationButton,
  Icon,
} from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { ACTIVITY_STATUSES } from "../../constants";
import { useActivities } from "../../hooks";
import type { Activity } from "../../types";
import classes from "./ActivityDetails.module.scss";

interface ActivityDetailsProps {
  readonly activityId: number;
}

const ActivityDetails: FC<ActivityDetailsProps> = ({ activityId }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const {
    approveActivitiesQuery,
    cancelActivitiesQuery,
    getSingleActivityQuery,
    redoActivitiesQuery,
    undoActivitiesQuery,
  } = useActivities();

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
    isPending: getSingleActivityQueryPending,
    error: getSingleActivityQueryError,
  } = getSingleActivityQuery({ activityId });

  const instanceId = getSingleActivityQueryResult?.data.computer_id;

  const isInstanceIdDefined = instanceId !== undefined;

  const { instance, isGettingInstance } = useGetInstance(
    { instanceId: instanceId as number },
    { enabled: isInstanceIdDefined },
  );

  if (getSingleActivityQueryPending) {
    return <LoadingState />;
  }

  if (getSingleActivityQueryError) {
    throw getSingleActivityQueryError;
  }

  if (isInstanceIdDefined && isGettingInstance) {
    return <LoadingState />;
  }

  const handleApproveActivity = async (a: Activity) => {
    try {
      await approveActivities({ query: `id:${a.id}` });

      closeSidePanel();

      notify.success({
        title: "You have successfully approved an activity.",
        message:
          "This activity will be delivered the next time the Landscape server connects with the client.",
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleCancelActivity = async (a: Activity) => {
    try {
      await cancelActivities({ query: `id:${a.id}` });

      closeSidePanel();

      notify.success({
        title: "You have successfully canceled an activity.",
        message:
          "This activity won't be delivered to the client and will not run.",
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleRedoActivity = async (a: Activity) => {
    try {
      await redoActivities({ activity_ids: [a.id] });

      closeSidePanel();

      notify.success({
        title: "You have successfully redone an activity.",
        message: "An activity has been queued to re-run this activity.",
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleUndoActivity = async (a: Activity) => {
    try {
      await undoActivities({ activity_ids: [a.id] });

      closeSidePanel();

      notify.success({
        title: "You have successfully undone an activity.",
        message:
          "An activity has been queued to revert the changes delivered by this activity.",
      });
    } catch (error) {
      debug(error);
    }
  };

  const activity = getSingleActivityQueryResult.data;

  return (
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
                    Are you sure you want to cancel {activity.summary} activity?
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
                    Are you sure you want to undo {activity.summary} activity?
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
                    Are you sure you want to redo {activity.summary} activity?
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

      <InfoGrid spaced>
        <InfoGrid.Item label="Description" large value={activity.summary} />

        {instance && (
          <InfoGrid.Item
            label="Instance"
            large
            value={
              <StaticLink
                to={`/instances/${instance.parent ? `${instance.parent.id}/${instance.id}` : instance.id}`}
              >
                {instance.title}
              </StaticLink>
            }
          />
        )}

        <InfoGrid.Item
          label="Status"
          value={
            <>
              <Icon
                name={ACTIVITY_STATUSES[activity.activity_status].icon}
                className={classes.statusIcon}
              />
              <span>{ACTIVITY_STATUSES[activity.activity_status].label}</span>
            </>
          }
        />
        <InfoGrid.Item
          label="Created at"
          value={moment(activity.creation_time).format(
            DISPLAY_DATE_TIME_FORMAT,
          )}
        />

        {typeof activity.delivery_time === "string" && (
          <InfoGrid.Item
            label="Delivered at"
            value={moment(activity.delivery_time).format(
              DISPLAY_DATE_TIME_FORMAT,
            )}
          />
        )}
        {activity.completion_time !== null && (
          <InfoGrid.Item
            label="Completed at"
            value={moment(activity.completion_time).format(
              DISPLAY_DATE_TIME_FORMAT,
            )}
          />
        )}
      </InfoGrid>

      {activity.result_text && (
        <CodeSnippet
          className={classes.output}
          blocks={[
            {
              title: "Output",
              code: activity.result_text,
            },
          ]}
        />
      )}
    </>
  );
};

export default ActivityDetails;
