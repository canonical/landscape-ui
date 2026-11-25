import { ActionBar } from "@/components/ui";
import {
  useApproveActivities,
  useCancelActivities,
  useRedoActivities,
  type Activity,
} from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { ConfirmationModal } from "@canonical/react-components";
import { Button } from "@canonical/react-ds-global";
import { useState, type FC } from "react";

interface ActivityDetailsButtonsProps {
  readonly activity: Activity;
  readonly onClose: () => void;
}

const ActivityDetailsButtons: FC<ActivityDetailsButtonsProps> = ({
  activity,
  onClose,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { approveActivities, isApprovingActivities } = useApproveActivities();
  const { cancelActivities, isCancelingActivities } = useCancelActivities();
  const { redoActivities, isRedoingActivities } = useRedoActivities();
  const [activeModal, setActiveModal] = useState<
    "approve" | "cancel" | "redo" | null
  >(null);

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleApproveActivity = async (a: Activity) => {
    try {
      await approveActivities({ query: `id:${a.id}` });

      onClose();

      notify.success({
        title: "You have successfully approved an activity.",
        message:
          "This activity will be delivered the next time the Landscape server connects with the client.",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
    }
  };

  const handleCancelActivity = async (a: Activity) => {
    try {
      await cancelActivities({ query: `id:${a.id}` });

      onClose();

      notify.success({
        title: "You have successfully canceled an activity.",
        message:
          "This activity won't be delivered to the client and will not run.",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
    }
  };

  const handleRedoActivity = async (a: Activity) => {
    try {
      await redoActivities({ activity_ids: [a.id] });

      onClose();

      notify.success({
        title: "You have successfully redone an activity.",
        message: "An activity has been queued to re-run this activity.",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
    }
  };

  const hasActions = Boolean(
    activity.actions?.approvable ||
    activity.actions?.cancelable ||
    activity.actions?.reappliable,
  );

  return (
    <>
      {hasActions && (
        <ActionBar>
          {activity.actions?.approvable && (
            <Button
              type="button"
              importance="secondary"
              disabled={isApprovingActivities}
              onClick={() => {
                setActiveModal("approve");
              }}
            >
              Approve
            </Button>
          )}
          {activity.actions?.cancelable && (
            <Button
              type="button"
              importance="secondary"
              disabled={isCancelingActivities}
              onClick={() => {
                setActiveModal("cancel");
              }}
            >
              {!activity.actions?.approvable && !activity.actions?.reappliable
                ? "Cancel activity"
                : "Cancel"}
            </Button>
          )}
          {activity.actions?.reappliable && (
            <Button
              type="button"
              importance="secondary"
              disabled={isRedoingActivities}
              onClick={() => {
                setActiveModal("redo");
              }}
            >
              Redo
            </Button>
          )}
        </ActionBar>
      )}
      {activeModal === "approve" && (
        <ConfirmationModal
          renderInPortal
          title="Approve activity"
          confirmButtonLabel="Approve"
          confirmButtonAppearance="positive"
          confirmButtonDisabled={isApprovingActivities}
          confirmButtonLoading={isApprovingActivities}
          onConfirm={async () => handleApproveActivity(activity)}
          close={closeModal}
        >
          <p className="u-margin--bottom">
            Are you sure you want to approve {activity.summary} activity?
          </p>
        </ConfirmationModal>
      )}
      {activeModal === "cancel" && (
        <ConfirmationModal
          renderInPortal
          title="Cancel activity"
          confirmButtonLabel="Confirm"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={isCancelingActivities}
          confirmButtonLoading={isCancelingActivities}
          onConfirm={async () => handleCancelActivity(activity)}
          close={closeModal}
        >
          <p className="u-margin--bottom">
            Are you sure you want to cancel {activity.summary} activity?
          </p>
        </ConfirmationModal>
      )}
      {activeModal === "redo" && (
        <ConfirmationModal
          renderInPortal
          title="Redo activity"
          confirmButtonLabel="Redo"
          confirmButtonAppearance="positive"
          confirmButtonDisabled={isRedoingActivities}
          confirmButtonLoading={isRedoingActivities}
          onConfirm={async () => handleRedoActivity(activity)}
          close={closeModal}
        >
          <p className="u-margin--bottom">
            Are you sure you want to redo {activity.summary} activity?
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default ActivityDetailsButtons;
