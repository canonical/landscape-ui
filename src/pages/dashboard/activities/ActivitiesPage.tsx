import type { FC } from "react";
import { useState } from "react";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import type { ActivityCommon } from "@/features/activities";
import { Activities, useActivities } from "@/features/activities";
import { ConfirmationButton } from "@canonical/react-components";
import useDebug from "@/hooks/useDebug";
import classes from "./ActivitiesPage.module.scss";

const ActivitiesPage: FC = () => {
  const [selected, setSelected] = useState<ActivityCommon[]>([]);

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
    } catch (error) {
      debug(error);
    }
  };

  const handleCancelActivities = async () => {
    try {
      await cancelActivities({ query: `id:${selectedIds.join(" OR id:")}` });
    } catch (error) {
      debug(error);
    }
  };

  const handleRedoActivities = async () => {
    try {
      await redoActivities({ activity_ids: selectedIds });
    } catch (error) {
      debug(error);
    }
  };

  const handleUndoActivities = async () => {
    try {
      await undoActivities({ activity_ids: selectedIds });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <PageMain>
      <PageHeader
        title="Activities"
        className={classes.header}
        actions={[
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
                  confirmButtonLabel: "Apply",
                  confirmButtonAppearance: "positive",
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
          </div>,
        ]}
      />
      <PageContent>
        <Activities selected={selected} setSelected={setSelected} />
      </PageContent>
    </PageMain>
  );
};

export default ActivitiesPage;
