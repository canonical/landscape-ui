import { TablePagination } from "@/components/layout/TablePagination";
import type { FC, ReactNode } from "react";
import { useCallback } from "react";
import type { ActivityCommon } from "../../types";
import ActivitiesHeader from "../ActivitiesHeader";
import usePageParams from "@/hooks/usePageParams";

interface ActivitiesProps {
  readonly children: ReactNode;
  readonly activities: ActivityCommon[];
  readonly activitiesCount: number | undefined;
  readonly selectedActivities?: ActivityCommon[];
  readonly setSelectedActivities?: (activities: ActivityCommon[]) => void;
  readonly instanceId?: number;
  readonly isAllSelected?: boolean;
  readonly onClearSelection?: () => void;
  readonly onExport?: () => void;
}

const Activities: FC<ActivitiesProps> = ({
  activities,
  activitiesCount: activityCount,
  instanceId,
  selectedActivities = [],
  setSelectedActivities,
  isAllSelected = false,
  onClearSelection,
  onExport,
  children,
}) => {
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
        availableActions={{
          approve: instanceId !== undefined,
          cancel: instanceId !== undefined,
          redo: instanceId !== undefined,
        }}
        availableFilters={{
          status: true,
          type: instanceId !== undefined,
          date: true,
        }}
        searchHelpTerms={{
          id: true,
          parentId: instanceId !== undefined,
          createdAfter: true,
          createdBefore: true,
          creator: true,
          computer: false,
          type: instanceId !== undefined,
        }}
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
