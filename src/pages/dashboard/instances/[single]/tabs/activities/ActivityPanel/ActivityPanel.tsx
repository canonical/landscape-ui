import type { FC } from "react";
import { useState } from "react";
import { Activities } from "@/features/activities";

interface ActivityPanelProps {
  readonly instanceId?: number;
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
