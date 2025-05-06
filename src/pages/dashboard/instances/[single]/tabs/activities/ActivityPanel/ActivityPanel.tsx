import type { FC } from "react";
import { useState } from "react";
import type { ActivityCommon } from "@/features/activities";
import { Activities } from "@/features/activities";

interface ActivityPanelProps {
  readonly instanceId?: number;
}

const ActivityPanel: FC<ActivityPanelProps> = ({ instanceId }) => {
  const [selected, setSelected] = useState<ActivityCommon[]>([]);

  return (
    <Activities
      instanceId={instanceId}
      selected={selected}
      setSelected={setSelected}
    />
  );
};

export default ActivityPanel;
