import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import type { ActivityCommon } from "@/features/activities";
import {
  ActivitiesActions,
  ActivitiesContainer,
  useGetActivities,
} from "@/features/activities";
import useSelection from "@/hooks/useSelection";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager/constants";
import { useCallback, useState, type FC } from "react";

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

  const [isAllSelected, setIsAllSelected] = useState(false);

  const clearSelection = useCallback(() => {
    setSelectedActivities([]);
    setIsAllSelected(false);
  }, [setSelectedActivities]);

  const selectAll = useCallback(() => {
    setIsAllSelected(true);
    setSelectedActivities([]);
  }, [setSelectedActivities]);

  return (
    <PageMain>
      <PageHeader
        title="Activities"
        actions={
          unfilteredActivitiesCount
            ? [
                <ActivitiesActions
                  selected={selectedActivities}
                  activityCount={activitiesCount}
                  key="activities-actions"
                  isAllSelected={isAllSelected}
                />,
              ]
            : undefined
        }
      />
      <PageContent hasTable>
        <ActivitiesContainer
          activities={activities}
          activitiesCount={activitiesCount}
          isGettingActivities={isGettingActivities}
          isGettingUnfilteredActivities={isGettingUnfilteredActivities}
          unfilteredActivitiesCount={unfilteredActivitiesCount}
          selectedActivities={selectedActivities}
          setSelectedActivities={setSelectedActivities}
          isAllSelected={isAllSelected}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
        />
      </PageContent>
    </PageMain>
  );
};

export default ActivitiesPage;
