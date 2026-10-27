import type { FC } from "react";
import type { ActivityCommon } from "../../types";
import ActivitiesPanelList from "../ActivitiesPanelList/ActivitiesPanelList";

interface ActivityChildrenProps {
  readonly activityId: number;
  readonly onActivityDetailsOpen: (activity: ActivityCommon) => void;
}

const ActivityChildren: FC<ActivityChildrenProps> = (props) => (
  <ActivitiesPanelList {...props} />
);

export default ActivityChildren;
