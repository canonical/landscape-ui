import { TablePagination } from "@/components/layout/TablePagination";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import type { FC, ReactNode } from "react";
import { useCallback } from "react";
import type { ActivityCommon } from "../../types";
import ActivitiesHeader from "../ActivitiesHeader";
import usePageParams from "@/hooks/usePageParams";
import {
  ACTIVITY_STATUS_OPTIONS,
  type ACTIVITY_SEARCH_HELP_TERMS,
} from "../ActivitiesHeader/constants";

interface ActivitiesProps {
  readonly children: ReactNode;
  readonly activities: ActivityCommon[];
  readonly activitiesCount: number | undefined;
  readonly searchHelpTerms: Readonly<
    Record<keyof typeof ACTIVITY_SEARCH_HELP_TERMS, boolean>
  >;
  readonly availableActions: Readonly<
    Record<"approve" | "cancel" | "redo", boolean>
  >;
  readonly availableFilters: Readonly<
    Record<"status" | "type" | "date", boolean>
  >;
  readonly selectedActivities?: ActivityCommon[];
  readonly setSelectedActivities?: (activities: ActivityCommon[]) => void;
  readonly isAllSelected?: boolean;
  readonly onClearSelection?: () => void;
  readonly onExport?: () => void;
}

const Activities: FC<ActivitiesProps> = ({
  activities,
  activitiesCount: activityCount,
  searchHelpTerms,
  availableActions,
  availableFilters,
  selectedActivities = [],
  setSelectedActivities,
  isAllSelected = false,
  onClearSelection,
  onExport,
  children,
}) => {
  useSetDynamicFilterValidation(
    "status",
    availableFilters.status
      ? ACTIVITY_STATUS_OPTIONS.map(({ value }) => value)
      : [],
  );

  const pageParams = usePageParams();

  const handleClearSelection = useCallback(() => {
    if (onClearSelection) {
      onClearSelection();
    } else {
      setSelectedActivities?.([]);
    }
  }, [setSelectedActivities, onClearSelection]);

  return (
    <>
      <ActivitiesHeader
        resetSelectedIds={handleClearSelection}
        selected={selectedActivities}
        isAllSelected={isAllSelected}
        availableActions={availableActions}
        availableFilters={availableFilters}
        searchHelpTerms={searchHelpTerms}
        filters={pageParams}
        onChangeFilters={pageParams.setPageParams}
        onExport={onExport}
      />
      {children}
      <TablePagination
        totalItems={activityCount}
        currentItemCount={activities.length}
        handleClearSelection={handleClearSelection}
      />
    </>
  );
};

export default Activities;
