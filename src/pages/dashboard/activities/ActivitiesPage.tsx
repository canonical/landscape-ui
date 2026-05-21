import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { lazy } from "react";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import type { ActivityCommon } from "@/features/activities";
import {
  Activities,
  ActivitiesActions,
  ActivitiesEmptyState,
  useGetActivities,
} from "@/features/activities";
import useSelection from "@/hooks/useSelection";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager/constants";
import type { FC } from "react";

const ActivityDetails = lazy(
  async () => import("@/features/activities/components/ActivityDetails"),
);

const ActivitiesPage: FC = () => {
  const { activities, activitiesCount, isGettingActivities } =
    useGetActivities();

  const {
    activitiesCount: unfilteredActivitiesCount,
    isGettingActivities: isGettingUnfilteredActivities,
  } = useGetActivities(
    {
      limit: DEFAULT_PAGE_SIZE,
      offset: 0,
    },
    { listenToUrlParams: false },
  );

  const {
    selectedItems: selectedActivities,
    setSelectedItems: setSelectedActivities,
  } = useSelection<ActivityCommon>(activities, isGettingActivities);

  const { lastSidePathSegment, name, popSidePathUntilClear } = usePageParams();
  useSetDynamicFilterValidation("sidePath", ["view"]);

  const viewActivity =
    lastSidePathSegment === "view" && name
      ? activities.find((a) => String(a.id) === name)
      : undefined;

  let activitiesContent = (
    <Activities
      activities={activities}
      activitiesCount={activitiesCount}
      isGettingActivities={isGettingActivities}
      selectedActivities={selectedActivities}
      setSelectedActivities={setSelectedActivities}
    />
  );

  if (isGettingUnfilteredActivities) {
    activitiesContent = <LoadingState />;
  } else if (!unfilteredActivitiesCount) {
    activitiesContent = <ActivitiesEmptyState />;
  }

  return (
    <PageMain>
      <PageHeader
        title="Activities"
        actions={
          unfilteredActivitiesCount
            ? [
                <ActivitiesActions
                  selected={selectedActivities}
                  key="activities-actions"
                />,
              ]
            : undefined
        }
      />
      <PageContent hasTable>{activitiesContent}</PageContent>
      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={lastSidePathSegment === "view" && !!name}
        size="small"
      >
        {lastSidePathSegment === "view" && !!name && (
          <SidePanel.Suspense key="view">
            <SidePanel.Header>
              {viewActivity?.summary || "Activity details"}
            </SidePanel.Header>
            <SidePanel.Content>
              <ActivityDetails activityId={Number(name)} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default ActivitiesPage;
