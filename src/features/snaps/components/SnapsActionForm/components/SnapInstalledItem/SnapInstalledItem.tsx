import { type FC } from "react";
import type { InstalledSnapWithCount } from "../../../../types";
import SnapItemTitleRow from "../SnapItemTitleRow";
import SnapItemSubtitle from "../SnapItemSubtitle";

interface SnapInstalledItemProps {
  readonly selectedSnap: InstalledSnapWithCount;
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
        computerCount={selectedSnap.computerCount}
        instancesCount={instancesCount}
      />
    </>
  );
};

export default SnapInstalledItem;
