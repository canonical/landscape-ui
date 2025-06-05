import type { ActivityCommon } from "@/features/activities";
import { Activities } from "@/features/activities";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useState } from "react";

interface ActivityPanelProps {
  readonly instanceId?: number;
}

const ActivityPanelBase: FC<ActivityPanelProps> = ({ instanceId }) => {
  const [selected, setSelected] = useState<ActivityCommon[]>([]);

  return (
    <Activities
      instanceId={instanceId}
      selected={selected}
      setSelected={setSelected}
    />
  );
};

const ActivityPanel: FC<ActivityPanelProps> = (props) => {
  const pageParams = usePageParams();

  return <ActivityPanelBase key={JSON.stringify(pageParams)} {...props} />;
};

export default ActivityPanel;
