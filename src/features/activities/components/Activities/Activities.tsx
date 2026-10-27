import { TablePagination } from "@/components/layout/TablePagination";
import type { FC } from "react";
import type { ActivityCommon } from "../../types";
import ActivitiesList from "../ActivitiesList";
import ActivitiesHeader from "../ActivitiesHeader";

interface ActivitiesProps {
  readonly activities: ActivityCommon[];
  readonly activitiesCount: number | undefined;
  readonly isGettingActivities: boolean;
  readonly selectedActivities: ActivityCommon[];
  readonly setSelectedActivities?: (activities: ActivityCommon[]) => void;
  readonly instanceId?: number;
  readonly isAllSelected?: boolean;
  readonly onSelectAll?: () => void;
  readonly onClearSelection?: () => void;
}

const Activities: FC<ActivitiesProps> = ({
  activities,
  activitiesCount,
  instanceId,
  isGettingActivities,
  selectedActivities,
  setSelectedActivities,
  isAllSelected = false,
  onSelectAll,
  onClearSelection,
}) => {
  const handleClearSelection = () => {
    onClearSelection?.();
    if (!onClearSelection) {
      setSelectedActivities?.([]);
    }
  };

  return (
    <>
      <ActivitiesHeader
        resetSelectedIds={handleClearSelection}
        selected={selectedActivities}
        isAllSelected={isAllSelected}
        isDetailView={instanceId !== undefined}
      />
      <ActivitiesList
        isActivityGroup={instanceId === undefined}
        activities={activities}
        activitiesCount={activitiesCount}
        isGettingActivities={isGettingActivities}
        selectedActivities={selectedActivities}
        setSelectedActivities={setSelectedActivities}
        instanceId={instanceId}
        isAllSelected={isAllSelected}
        onSelectAll={onSelectAll}
        onClearSelection={onClearSelection}
      />
      <TablePagination
        totalItems={activitiesCount}
        currentItemCount={activities.length}
        handleClearSelection={handleClearSelection}
      />
    </>
  );
};

export default Activities;
