import {
  useApproveActivities,
  useCancelActivities,
  useRedoActivities,
  type Activity,
} from "@/features/activities";
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
  const { approveActivities, isApprovingActivities } = useApproveActivities();
  const { cancelActivities, isCancelingActivities } = useCancelActivities();
  const { redoActivities, isRedoingActivities } = useRedoActivities();

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

  return (
    <div key="buttons" className="p-segmented-control">
      <div className="p-segmented-control__list">
        {activity.actions?.approvable && (
          <ConfirmationButton
            className="p-segmented-control__button u-no-margin"
            type="button"
            disabled={isApprovingActivities}
            confirmationModalProps={{
              title: "Approve activity",
              children: (
                <p>
                  Are you sure you want to approve {activity.summary} activity?
                </p>
              ),
              confirmButtonLabel: "Approve",
              confirmButtonAppearance: "positive",
              confirmButtonDisabled: isApprovingActivities,
              confirmButtonLoading: isApprovingActivities,
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
            disabled={isCancelingActivities}
            confirmationModalProps={{
              title: "Cancel activity",
              children: (
                <p>
                  Are you sure you want to cancel {activity.summary} activity?
                </p>
              ),
              confirmButtonLabel: "Confirm",
              confirmButtonAppearance: "negative",
              confirmButtonDisabled: isCancelingActivities,
              confirmButtonLoading: isCancelingActivities,
              onConfirm: async () => handleCancelActivity(activity),
            }}
          >
            {!activity.actions?.approvable && !activity.actions?.reappliable
              ? "Cancel activity"
              : "Cancel"}
          </ConfirmationButton>
        )}
        {activity.actions?.reappliable && (
          <ConfirmationButton
            className="p-segmented-control__button u-no-margin"
            type="button"
            disabled={isRedoingActivities}
            confirmationModalProps={{
              title: "Redo activity",
              children: (
                <p>
                  Are you sure you want to redo {activity.summary} activity?
                </p>
              ),
              confirmButtonLabel: "Redo",
              confirmButtonAppearance: "positive",
              confirmButtonDisabled: isRedoingActivities,
              confirmButtonLoading: isRedoingActivities,
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
