import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import type { ActivityCommon } from "@/features/activities";
import {
  ActivityDetails,
  ActivitiesContainer,
  useGetActivityParents,
  ActivitiesList,
} from "@/features/activities";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager/constants";
import { useCallback, type FC } from "react";

const ActivitiesPage: FC = () => {
  const { activities, activitiesCount, isGettingActivities } =
    useGetActivityParents();

  const {
    activitiesCount: unfilteredActivitiesCount,
    isGettingActivities: isGettingUnfilteredActivities,
  } = useGetActivityParents(
    {
      limit: DEFAULT_PAGE_SIZE,
      offset: 0,
    },
    { listenToUrlParams: false },
  );

  useSetDynamicFilterValidation("sidePath", ["activity"]);

  const { name, lastSidePathSegment, setPageParams, popSidePathUntilClear } =
    usePageParams();

  const handleActivityDetailsOpen = useCallback(
    (activity: ActivityCommon) => {
      setPageParams({
        sidePath: ["activity"],
        name: String(activity.id),
      });
    },
    [setPageParams],
  );

  const activityId = Number(name);
  const isValidActivityId = Number.isInteger(activityId) && activityId > 0;
  const isActivityPanelOpen =
    lastSidePathSegment === "activity" && isValidActivityId;

  return (
    <PageMain>
      <PageHeader title="Activities" />
      <PageContent hasTable>
        <ActivitiesContainer
          activities={activities}
          activitiesCount={activitiesCount}
          isGettingUnfilteredActivities={isGettingUnfilteredActivities}
          unfilteredActivitiesCount={unfilteredActivitiesCount}
        >
          <ActivitiesList
            header="Activity group"
            activities={activities}
            activitiesCount={activitiesCount}
            isGettingActivities={isGettingActivities}
            selectionEnabled={false}
            onActivityDetailsOpen={handleActivityDetailsOpen}
          />
        </ActivitiesContainer>
      </PageContent>

      <SidePanel
        isOpen={isActivityPanelOpen}
        onClose={popSidePathUntilClear}
        contentKey={`activity-${name}`}
      >
        {isActivityPanelOpen && (
          <SidePanel.Suspense key={`activity-${name}`}>
            <ActivityDetails
              activityId={activityId}
              onClose={popSidePathUntilClear}
              renderInSidePanel
              hideInstanceField
            />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default ActivitiesPage;
