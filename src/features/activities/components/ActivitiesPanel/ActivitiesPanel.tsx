import SidePanel from "@/components/layout/SidePanel";
import { lazy, useState, type FC } from "react";
import type { ActivityCommon } from "../../types";
import ActivitiesPanelList from "../ActivitiesPanelList/ActivitiesPanelList";

const ActivityDetails = lazy(async () => import("../ActivityDetails"));

interface ActivitiesPanelProps {
  readonly initialStatus: string;
}

const ActivitiesPanel: FC<ActivitiesPanelProps> = ({ initialStatus }) => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityCommon>();
  const closeDetails = () => {
    setSelectedActivity(undefined);
  };

  return (
    <>
      <ActivitiesPanelList
        initialStatus={initialStatus}
        onActivityDetailsOpen={setSelectedActivity}
      />
      {selectedActivity && (
        <SidePanel isOpen size="small" onClose={closeDetails}>
          <SidePanel.Suspense>
            <SidePanel.Header>{selectedActivity.summary}</SidePanel.Header>
            <SidePanel.Content>
              <ActivityDetails
                key={selectedActivity.id}
                activityId={selectedActivity.id}
                onClose={closeDetails}
              />
            </SidePanel.Content>
          </SidePanel.Suspense>
        </SidePanel>
      )}
    </>
  );
};

export default ActivitiesPanel;
