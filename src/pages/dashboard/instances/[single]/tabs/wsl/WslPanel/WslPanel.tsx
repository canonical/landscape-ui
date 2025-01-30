import type { FC } from "react";
import { WslInstanceList, WslInstancesEmptyState } from "@/features/wsl";
import type { WindowsInstance } from "@/types/Instance";

interface WslPanelProps {
  readonly instance: WindowsInstance;
}

const WslPanel: FC<WslPanelProps> = ({ instance }) => {
  return instance.children.length !== 0 ? (
    <WslInstanceList instance={instance} />
  ) : (
    <WslInstancesEmptyState />
  );
};

export default WslPanel;
