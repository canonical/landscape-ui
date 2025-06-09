import type { ActivityCommon } from "@/features/activities";
import { Activities, useGetActivities } from "@/features/activities";
import useSelection from "@/hooks/useSelection";
import type { FC } from "react";

interface ActivityPanelProps {
  readonly instanceId?: number;
}

const ActivityPanel: FC<ActivityPanelProps> = ({ instanceId }) => {
  const {
    selectedItems: selectedActivities,
    setSelectedItems: setSelectedActivities,
    validate: validateActivities,
  } = useSelection<ActivityCommon>();

  const { activities, activitiesCount, isGettingActivities } = useGetActivities(
    { query: `computer:id:${instanceId}` },
  );

  validateActivities(activities, isGettingActivities);

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
