import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import type { ActivityCommon } from "@/features/activities";
import {
  Activities,
  ActivitiesActions,
  useGetActivities,
} from "@/features/activities";
import useSelection from "@/hooks/useSelection";
import type { FC } from "react";
import classes from "./ActivitiesPage.module.scss";

const ActivitiesPage: FC = () => {
  const { activities, activitiesCount, isGettingActivities } =
    useGetActivities();

  const {
    selectedItems: selectedActivities,
    setSelectedItems: setSelectedActivities,
  } = useSelection<ActivityCommon>(activities, isGettingActivities);

  return (
    <PageMain>
      <PageHeader
        title="Activities"
        className={classes.header}
        actions={[
          <ActivitiesActions
            selected={selectedActivities}
            key="activities-actions"
          />,
        ]}
      />
      <PageContent>
        <Activities
          activities={activities}
          activitiesCount={activitiesCount}
          isGettingActivities={isGettingActivities}
          selectedActivities={selectedActivities}
          setSelectedActivities={setSelectedActivities}
        />
      </PageContent>
    </PageMain>
  );
};

export default ActivitiesPage;
