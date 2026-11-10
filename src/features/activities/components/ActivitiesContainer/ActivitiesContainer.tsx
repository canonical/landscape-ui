import LoadingState from "@/components/layout/LoadingState";
import type { FC, ReactNode } from "react";
import type { ActivityCommon } from "../../types";
import Activities from "../Activities";
import ActivitiesEmptyState from "../ActivitiesEmptyState";

interface ActivitiesContainerProps {
  readonly children: ReactNode;
  readonly activities: ActivityCommon[];
  readonly activitiesCount: number | undefined;
  readonly isGettingUnfilteredActivities: boolean;
  readonly unfilteredActivitiesCount: number | undefined;
  readonly selectedActivities: ActivityCommon[];
  readonly setSelectedActivities: (activities: ActivityCommon[]) => void;
  readonly isAllSelected: boolean;
  readonly onClearSelection: () => void;
}

const ActivitiesContainer: FC<ActivitiesContainerProps> = ({
  children,
  activities,
  activitiesCount,
  isGettingUnfilteredActivities,
  unfilteredActivitiesCount,
  selectedActivities,
  setSelectedActivities,
  isAllSelected,
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
      selectedActivities={selectedActivities}
      setSelectedActivities={setSelectedActivities}
      isAllSelected={isAllSelected}
      onClearSelection={onClearSelection}
    >
      {children}
    </Activities>
  );
};

export default ActivitiesContainer;
