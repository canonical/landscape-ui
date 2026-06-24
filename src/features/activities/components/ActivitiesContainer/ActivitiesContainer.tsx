import LoadingState from "@/components/layout/LoadingState";
import type { FC } from "react";
import type { ActivityCommon } from "../../types";
import Activities from "../Activities";
import ActivitiesEmptyState from "../ActivitiesEmptyState";

interface ActivitiesContainerProps {
  readonly activities: ActivityCommon[];
  readonly activitiesCount: number | undefined;
  readonly isGettingActivities: boolean;
  readonly isGettingUnfilteredActivities: boolean;
  readonly unfilteredActivitiesCount: number | undefined;
  readonly selectedActivities: ActivityCommon[];
  readonly setSelectedActivities: (activities: ActivityCommon[]) => void;
  readonly isAllSelected: boolean;
  readonly onSelectAll: () => void;
  readonly onClearSelection: () => void;
}

const ActivitiesContainer: FC<ActivitiesContainerProps> = ({
  activities,
  activitiesCount,
  isGettingActivities,
  isGettingUnfilteredActivities,
  unfilteredActivitiesCount,
  selectedActivities,
  setSelectedActivities,
  isAllSelected,
  onSelectAll,
  onClearSelection,
}) => {
  if (isGettingUnfilteredActivities) {
    return <LoadingState />;
  }

  if (!unfilteredActivitiesCount) {
    return <ActivitiesEmptyState />;
  }

  return (
    <Activities
      activities={activities}
      activitiesCount={activitiesCount}
      isGettingActivities={isGettingActivities}
      selectedActivities={selectedActivities}
      setSelectedActivities={setSelectedActivities}
      isAllSelected={isAllSelected}
      onSelectAll={onSelectAll}
      onClearSelection={onClearSelection}
    />
  );
};

export default ActivitiesContainer;
