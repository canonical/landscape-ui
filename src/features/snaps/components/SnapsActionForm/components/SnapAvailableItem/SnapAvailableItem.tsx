import { type FC } from "react";
import type { InstalledSnapWithCount } from "../../../../types";
import SnapItemTitleRow from "../SnapItemTitleRow";

interface SnapAvailableItemProps {
  readonly selectedSnap: InstalledSnapWithCount;
  readonly onDelete: () => void;
}

const SnapAvailableItem: FC<SnapAvailableItemProps> = ({
  onDelete,
  selectedSnap,
}) => {
  return (
    <>
      <SnapItemTitleRow name={selectedSnap.snap.name} onDelete={onDelete} />
      {/* TODO: Add SnapChannelRevisionFields component here */}
    </>
  );
};

export default SnapAvailableItem;
