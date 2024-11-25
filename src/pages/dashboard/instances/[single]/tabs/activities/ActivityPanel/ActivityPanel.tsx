import { FC, useState } from "react";
import { Activities } from "@/features/activities";

interface ActivityPanelProps {
  instanceId?: number;
}

const ActivityPanel: FC<ActivityPanelProps> = ({ instanceId }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  return (
    <Activities
      instanceId={instanceId}
      selectedIds={selectedIds}
      setSelectedIds={(items) => setSelectedIds(items)}
    />
  );
};

export default ActivityPanel;
