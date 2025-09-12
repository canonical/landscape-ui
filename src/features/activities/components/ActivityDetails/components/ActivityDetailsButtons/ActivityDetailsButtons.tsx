import { useActivities, type Activity } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { ConfirmationButton } from "@canonical/react-components";
import type { FC } from "react";

interface ActivityDetailsButtonsProps {
  readonly activity: Activity;
}

const ActivityDetailsButtons: FC<ActivityDetailsButtonsProps> = ({
  activity,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const {
    approveActivitiesQuery,
    cancelActivitiesQuery,
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

  return (
    <div key="buttons" className="p-segmented-control">
      <div className="p-segmented-control__list">
        {activity.actions?.approvable && (
          <ConfirmationButton
            className="p-segmented-control__button u-no-margin"
            type="button"
            disabled={approveActivitiesLoading}
            confirmationModalProps={{
              title: "Approve activity",
              children: (
                <p>
                  Are you sure you want to approve {activity.summary} activity?
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
            className="p-segmented-control__button u-no-margin"
            type="button"
            disabled={cancelActivitiesLoading}
            confirmationModalProps={{
              title: "Cancel activity",
              children: (
                <p>
                  Are you sure you want to cancel {activity.summary} activity?
                </p>
              ),
              confirmButtonLabel: "Confirm",
              confirmButtonAppearance: "negative",
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
            className="p-segmented-control__button u-no-margin"
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
            className="p-segmented-control__button u-no-margin"
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
  );
};

export default ActivityDetailsButtons;
