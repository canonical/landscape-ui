import SidePanel from "@/components/layout/SidePanel";
import LoadingState from "@/components/layout/LoadingState";
import type { ActivityCommon } from "@/features/activities";
import {
  Activities,
  ActivitiesEmptyState,
  useGetActivities,
} from "@/features/activities";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import useSelection from "@/hooks/useSelection";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager/constants";
import { lazy, type FC } from "react";

const ActivityDetails = lazy(
  async () => import("@/features/activities/components/ActivityDetails"),
);

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

  const { lastSidePathSegment, name, popSidePathUntilClear } = usePageParams();
  useSetDynamicFilterValidation("sidePath", ["view"]);

  if (isGettingUnfilteredActivities) {
    return <LoadingState />;
  }

  if (!unfilteredActivitiesCount) {
    return <ActivitiesEmptyState />;
  }

  return (
    <>
      <Activities
        activities={activities}
        activitiesCount={activitiesCount}
        isGettingActivities={isGettingActivities}
        instanceId={instanceId}
        selectedActivities={selectedActivities}
        setSelectedActivities={setSelectedActivities}
      />

      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={lastSidePathSegment === "view" && !!name}
        size="small"
      >
        {lastSidePathSegment === "view" && !!name && (
          <SidePanel.Suspense key="view">
            <SidePanel.Header>Activity details</SidePanel.Header>
            <SidePanel.Content>
              <ActivityDetails activityId={Number(name)} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </>
  );
};

export default ActivityPanel;
