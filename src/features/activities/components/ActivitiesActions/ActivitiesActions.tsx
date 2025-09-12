import type { FC } from "react";
import { useActivities } from "../../hooks";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { ActivityCommon } from "../../types";
import { pluralize } from "@/utils/_helpers";
import { ConfirmationButton } from "@canonical/react-components";

interface ActivitiesActionsProps {
  readonly selected: ActivityCommon[];
}

const ActivitiesActions: FC<ActivitiesActionsProps> = ({ selected }) => {
  const { notify } = useNotify();
  const debug = useDebug();
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

  const selectedIds = selected.map((activity) => activity.id);

  const handleApproveActivities = async () => {
    try {
      await approveActivities({ query: `id:${selectedIds.join(" OR id:")}` });

      notify.success({
        title: `You have successfully approved ${pluralize(selected.length, "an activity", `${selected.length} activities`)}.`,
        message: `${pluralize(selected.length, "This activity", "These activities")} will be delivered the next time the Landscape server connects with the client.`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleCancelActivities = async () => {
    try {
      await cancelActivities({ query: `id:${selectedIds.join(" OR id:")}` });

      notify.success({
        title: `You have successfully canceled ${pluralize(selected.length, "an activity", `${selected.length} activities`)}.`,
        message: `${pluralize(selected.length, "This activity", "These activities")} won't be delivered to the client and will not run.`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleRedoActivities = async () => {
    try {
      await redoActivities({ activity_ids: selectedIds });

      notify.success({
        title: `You have successfully redone ${pluralize(selected.length, "an activity", `${selected.length} activities`)}.`,
        message: `${pluralize(
          selected.length,
          "An activity has been queued to re-run this activity.",
          "Activities have been queued to re-run these activities.",
        )}`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleUndoActivities = async () => {
    try {
      await undoActivities({ activity_ids: selectedIds });

      notify.success({
        title: `You have successfully undone ${pluralize(selected.length, "an activity", `${selected.length} activities`)}.`,
        message: `${pluralize(
          selected.length,
          "An activity has been queued to revert the changes delivered by this activity.",
          "Activities have been queued to revert the changes delivered by these activities.",
        )}`,
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <div key="buttons" className="p-segmented-control">
      <div className="p-segmented-control__list">
        <ConfirmationButton
          className="p-segmented-control__button"
          type="button"
          disabled={
            !selected.length ||
            approveActivitiesLoading ||
            selected.some((activity) => !activity.actions?.approvable)
          }
          confirmationModalProps={{
            title: `Approve ${selected.length === 1 ? "activity" : "activities"}`,
            children: (
              <p>
                Are you sure you want to approve selected{" "}
                {selected.length === 1 ? "activity" : "activities"}?
              </p>
            ),
            confirmButtonLabel: "Approve",
            confirmButtonAppearance: "positive",
            confirmButtonDisabled: approveActivitiesLoading,
            confirmButtonLoading: approveActivitiesLoading,
            onConfirm: handleApproveActivities,
          }}
        >
          Approve
        </ConfirmationButton>
        <ConfirmationButton
          className="p-segmented-control__button"
          type="button"
          disabled={
            !selected.length ||
            cancelActivitiesLoading ||
            selected.some((activity) => !activity.actions?.cancelable)
          }
          confirmationModalProps={{
            title: `Cancel ${selected.length === 1 ? "activity" : "activities"}`,
            children: (
              <p>
                Are you sure you want to cancel selected{" "}
                {selected.length === 1 ? "activity" : "activities"}?
              </p>
            ),
            confirmButtonLabel: "Confirm",
            confirmButtonAppearance: "negative",
            confirmButtonDisabled: cancelActivitiesLoading,
            confirmButtonLoading: cancelActivitiesLoading,
            onConfirm: handleCancelActivities,
          }}
        >
          Cancel
        </ConfirmationButton>
        <ConfirmationButton
          className="p-segmented-control__button"
          type="button"
          disabled={
            !selected.length ||
            undoActivitiesLoading ||
            selected.some((activity) => !activity.actions?.revertable)
          }
          confirmationModalProps={{
            title: `Undo ${selected.length === 1 ? "activity" : "activities"}`,
            children: (
              <p>
                Are you sure you want to undo selected{" "}
                {selected.length === 1 ? "activity" : "activities"}?
              </p>
            ),
            confirmButtonLabel: "Undo",
            confirmButtonAppearance: "positive",
            confirmButtonDisabled: undoActivitiesLoading,
            confirmButtonLoading: undoActivitiesLoading,
            onConfirm: handleUndoActivities,
          }}
        >
          Undo
        </ConfirmationButton>
        <ConfirmationButton
          className="p-segmented-control__button"
          type="button"
          disabled={
            !selected.length ||
            redoActivitiesLoading ||
            selected.some((activity) => !activity.actions?.reappliable)
          }
          confirmationModalProps={{
            title: `Redo ${selected.length === 1 ? "activity" : "activities"}`,
            children: (
              <p>
                Are you sure you want to redo selected{" "}
                {selected.length === 1 ? "activity" : "activities"}?
              </p>
            ),
            confirmButtonLabel: "Redo",
            confirmButtonAppearance: "positive",
            confirmButtonDisabled: redoActivitiesLoading,
            confirmButtonLoading: redoActivitiesLoading,
            onConfirm: handleRedoActivities,
          }}
        >
          Redo
        </ConfirmationButton>
      </div>
    </div>
  );
};

export default ActivitiesActions;
