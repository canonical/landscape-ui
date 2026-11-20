import { type FC } from "react";
import type { SnapWithCount } from "../../../../types";
import SnapItemTitleRow from "../SnapItemTitleRow";
import SnapItemSubtitle from "../SnapItemSubtitle";

interface SnapInstalledItemProps {
  readonly selectedSnap: SnapWithCount;
  readonly onDelete: () => void;
  readonly isUnhold: boolean;
  readonly instancesCount: number;
}

const SnapInstalledItem: FC<SnapInstalledItemProps> = ({
  onDelete,
  selectedSnap,
  isUnhold,
  instancesCount,
}) => {
  return (
    <>
      <SnapItemTitleRow name={selectedSnap.snap.name} onDelete={onDelete} />
      <SnapItemSubtitle
        scope={isUnhold ? "Held" : "Installed"}
        computerCount={selectedSnap.computer_count ?? 0}
        instancesCount={instancesCount}
      />
    </>
  );
};

export default SnapInstalledItem;
