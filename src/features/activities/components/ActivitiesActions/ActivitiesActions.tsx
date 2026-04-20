import type { FC } from "react";
import { useActivities } from "../../hooks";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { ActivityCommon } from "../../types";
import { pluralize, pluralizeArray } from "@/utils/_helpers";
import { ConfirmationButton } from "@canonical/react-components";

interface ActivitiesActionsProps {
  readonly selected: ActivityCommon[];
}

const ActivitiesActions: FC<ActivitiesActionsProps> = ({ selected }) => {
  const { notify } = useNotify();
  const debug = useDebug();
  const { approveActivitiesQuery, cancelActivitiesQuery, redoActivitiesQuery } =
    useActivities();

  const {
    mutateAsync: approveActivities,
    isPending: approveActivitiesLoading,
  } = approveActivitiesQuery;
  const { mutateAsync: cancelActivities, isPending: cancelActivitiesLoading } =
    cancelActivitiesQuery;
  const { mutateAsync: redoActivities, isPending: redoActivitiesLoading } =
    redoActivitiesQuery;

  const selectedIds = selected.map((activity) => activity.id);
  const quantifiedActivity = pluralizeArray(
    selected,
    () => "an activity",
    `activities`,
  );
  const pluralizedActivity = pluralize(
    selected.length,
    "activity",
    "activities",
  );

  const handleApproveActivities = async () => {
    try {
      await approveActivities({ query: `id:${selectedIds.join(" OR id:")}` });

      notify.success({
        title: `You have successfully approved ${quantifiedActivity}.`,
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
        title: `You have successfully canceled ${quantifiedActivity}.`,
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
        title: `You have successfully redone ${quantifiedActivity}.`,
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
            title: `Approve ${pluralizedActivity}`,
            children: (
              <p>
                Are you sure you want to approve selected {pluralizedActivity}?
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
            title: `Cancel ${pluralizedActivity}`,
            children: (
              <p>
                Are you sure you want to cancel selected {pluralizedActivity}?
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
            redoActivitiesLoading ||
            selected.some((activity) => !activity.actions?.reappliable)
          }
          confirmationModalProps={{
            title: `Redo ${pluralizedActivity}`,
            children: (
              <p>
                Are you sure you want to redo selected {pluralizedActivity}?
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
