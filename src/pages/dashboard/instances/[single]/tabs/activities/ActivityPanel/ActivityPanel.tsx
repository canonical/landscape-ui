import { FC } from "react";
import { Activities } from "@/features/activities";

interface ActivityPanelProps {
  instanceId?: number;
}

const ActivityPanel: FC<ActivityPanelProps> = ({ instanceId }) => {
  return <Activities instanceId={instanceId} />;
};

export default ActivityPanel;
