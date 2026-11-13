import { type FC } from "react";
import type { SnapWithCount } from "../../../../types";
import SnapItemTitleRow from "../SnapItemTitleRow";
import SnapItemSubtitle from "../SnapItemSubtitle";

interface SnapInstalledItemProps {
  readonly selectedSnap: SnapWithCount;
  readonly isUnhold: boolean;
  readonly instancesCount: number;
  readonly onDelete?: () => void;
  readonly hasSubtitle?: boolean;
}

const SnapInstalledItem: FC<SnapInstalledItemProps> = ({
  onDelete,
  selectedSnap,
  isUnhold,
  instancesCount,
  hasSubtitle = true,
}) => {
  return (
    <>
      <SnapItemTitleRow name={selectedSnap.snap.name} onDelete={onDelete} />
      {hasSubtitle && (
        <SnapItemSubtitle
          scope={isUnhold ? "Held" : "Installed"}
          computerCount={selectedSnap.computer_count ?? 0}
          instancesCount={instancesCount}
        />
      )}
    </>
  );
};

export default SnapInstalledItem;
