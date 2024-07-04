import { FC } from "react";
import { WslInstanceList, WslInstancesEmptyState } from "@/features/wsl";
import { Instance } from "@/types/Instance";

interface WslPanelProps {
  instance: Instance;
}

const WslPanel: FC<WslPanelProps> = ({ instance }) => {
  return instance.children.length !== 0 ? (
    <WslInstanceList instance={instance} />
  ) : (
    <WslInstancesEmptyState />
  );
};

export default WslPanel;
