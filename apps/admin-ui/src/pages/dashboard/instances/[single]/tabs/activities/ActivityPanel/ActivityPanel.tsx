import LoadingState from "@/components/layout/LoadingState";
import type { ActivityCommon } from "@/features/activities";
import {
  Activities,
  ActivitiesEmptyState,
  useGetActivities,
} from "@/features/activities";
import useSelection from "@/hooks/useSelection";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager/constants";
import type { FC } from "react";

interface ActivityPanelProps {
  readonly instanceId?: number;
}

const ActivityPanel: FC<ActivityPanelProps> = ({ instanceId }) => {
  const { activities, activitiesCount, isGettingActivities } = useGetActivities(
    { query: `computer:id:${instanceId}` },
  );

  const {
    activitiesCount: unfilteredActivitiesCount,
    isGettingActivities: isGettingUnfilteredActivities,
  } = useGetActivities(
    {
      limit: DEFAULT_PAGE_SIZE,
      offset: 0,
      query: `computer:id:${instanceId}`,
    },
    { listenToUrlParams: false },
  );

  const {
    selectedItems: selectedActivities,
    setSelectedItems: setSelectedActivities,
  } = useSelection<ActivityCommon>(activities, isGettingActivities);

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
      instanceId={instanceId}
      selectedActivities={selectedActivities}
      setSelectedActivities={setSelectedActivities}
    />
  );
};

export default ActivityPanel;
