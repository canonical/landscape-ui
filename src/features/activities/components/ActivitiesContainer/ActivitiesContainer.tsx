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
}

const ActivitiesContainer: FC<ActivitiesContainerProps> = ({
  children,
  activities,
  activitiesCount,
  isGettingUnfilteredActivities,
  unfilteredActivitiesCount,
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
      availableActions={{
        approve: false,
        cancel: false,
        redo: false,
      }}
      availableFilters={{
        status: true,
        type: false,
        date: true,
      }}
      searchHelpTerms={{
        id: true,
        parentId: false,
        createdAfter: true,
        createdBefore: true,
        creator: true,
        computer: false,
        type: false,
      }}
    >
      {children}
    </Activities>
  );
};

export default ActivitiesContainer;
