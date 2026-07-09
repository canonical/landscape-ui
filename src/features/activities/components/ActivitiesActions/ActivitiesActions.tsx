import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, ConfirmationButton } from "@canonical/react-components";
import { lazy, Suspense, type FC } from "react";
import type { ActivityCommon } from "../../types";
import { pluralize } from "@/utils/_helpers";
import { getExportTitle } from "@/features/exports";
import {
  useApproveActivities,
  useCancelActivities,
  useRedoActivities,
} from "../../api";

const ActivitiesExportForm = lazy(
  async () => import("../ActivitiesExportForm"),
);

interface ActivitiesActionsProps {
  readonly selected: ActivityCommon[];
  readonly activityCount?: number;
  readonly isAllSelected?: boolean;
  readonly exportBaseQuery?: string;
}

const ActivitiesActions: FC<ActivitiesActionsProps> = ({
  selected,
  activityCount,
  isAllSelected = false,
  exportBaseQuery = "",
}) => {
  const { notify } = useNotify();
  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const { query, search, status, fromDate, toDate, type } = usePageParams();
  const { approveActivities, isApprovingActivities } = useApproveActivities();
  const { cancelActivities, isCancelingActivities } = useCancelActivities();
  const { redoActivities, isRedoingActivities } = useRedoActivities();

  const selectedIds = selected.map((activity) => activity.id);

  const exportQuery = [
    exportBaseQuery,
    search,
    query,
    status ? `status:${status}` : "",
    fromDate ? `created-after:${fromDate}` : "",
    toDate ? `created-before:${toDate}` : "",
    type ? `type:${type}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const title = pluralize(selected.length, ["activity", "activities"], "exact");

  const handleExport = () => {
    setSidePanelContent(
      getExportTitle({
        isAllSelected,
        selectedCount: selected.length,
        totalCount: activityCount,
        selectionForms: ["activity", "activities"],
      }),
      <Suspense fallback={<LoadingState />}>
        <ActivitiesExportForm
          exportParams={{ query: exportQuery }}
          selectedActivityIds={
            !isAllSelected && selected.length > 0 ? selectedIds : undefined
          }
        />
      </Suspense>,
      "medium",
    );
  };

  const handleApproveActivities = async () => {
    try {
      await approveActivities({ query: `id:${selectedIds.join(" OR id:")}` });

      notify.success({
        title: `You have successfully approved ${title}.`,
        message: `${pluralize(selected.length, ["This activity", "These activities"])} will be delivered the next time the Landscape server connects with the client.`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleCancelActivities = async () => {
    try {
      await cancelActivities({ query: `id:${selectedIds.join(" OR id:")}` });

      notify.success({
        title: `You have successfully canceled ${title}.`,
        message: `${pluralize(selected.length, ["This activity", "These activities"])} won't be delivered to the client and will not run.`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleRedoActivities = async () => {
    try {
      await redoActivities({ activity_ids: selectedIds });

      notify.success({
        title: `You have successfully redone ${title}.`,
        message: `${pluralize(selected.length, ["An activity has been queued to re-run this activity.", "Activities have been queued to re-run these activities."])}`,
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <div key="buttons" className="p-segmented-control">
      <div className="p-segmented-control__list">
        <Button
          className="p-segmented-control__button"
          type="button"
          disabled={!isAllSelected && selected.length === 0}
          onClick={handleExport}
        >
          <span>Export selection as TSV</span>
        </Button>
        <ConfirmationButton
          className="p-segmented-control__button"
          type="button"
          disabled={
            !selected.length ||
            isApprovingActivities ||
            selected.some((activity) => !activity.actions?.approvable)
          }
          confirmationModalProps={{
            title: `Approve ${title}`,
            children: <p>Are you sure you want to approve {title}?</p>,
            confirmButtonLabel: "Approve",
            confirmButtonAppearance: "positive",
            confirmButtonDisabled: isApprovingActivities,
            confirmButtonLoading: isApprovingActivities,
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
            isCancelingActivities ||
            selected.some((activity) => !activity.actions?.cancelable)
          }
          confirmationModalProps={{
            title: `Cancel ${title}`,
            children: <p>Are you sure you want to cancel {title}?</p>,
            confirmButtonLabel: "Confirm",
            confirmButtonAppearance: "negative",
            confirmButtonDisabled: isCancelingActivities,
            confirmButtonLoading: isCancelingActivities,
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
            isRedoingActivities ||
            selected.some((activity) => !activity.actions?.reappliable)
          }
          confirmationModalProps={{
            title: `Redo ${title}`,
            children: <p>Are you sure you want to redo {title}?</p>,
            confirmButtonLabel: "Redo",
            confirmButtonAppearance: "positive",
            confirmButtonDisabled: isRedoingActivities,
            confirmButtonLoading: isRedoingActivities,
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
