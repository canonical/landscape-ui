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

  return (
    <PageMain>
      <PageHeader
        title="Activities"
        sticky
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
      <PageContent>
        {isGettingUnfilteredActivities ? (
          <LoadingState />
        ) : !unfilteredActivitiesCount ? (
          <ActivitiesEmptyState />
        ) : (
          <Activities
            activities={activities}
            activitiesCount={activitiesCount}
            isGettingActivities={isGettingActivities}
            selectedActivities={selectedActivities}
            setSelectedActivities={setSelectedActivities}
          />
        )}
      </PageContent>
    </PageMain>
  );
};

export default ActivitiesPage;
