import { type FC } from "react";
import type { InstalledSnapWithCount } from "../../../../types";
import classes from "./SnapInstalledItem.module.scss";
import { Button, Icon, ICONS } from "@canonical/react-components";
import { pluralize } from "@/utils/_helpers";

interface SnapInstalledItemProps {
  readonly selectedSnap: InstalledSnapWithCount;
  readonly onDelete: () => void;
  readonly isUnhold: boolean;
  readonly selectedInstances: number;
}

const SnapInstalledItem: FC<SnapInstalledItemProps> = ({
  onDelete,
  selectedSnap,
  isUnhold,
  selectedInstances,
}) => {
  const scope = isUnhold ? "Held" : "Installed";

  return (
    <li className={classes.selectedContainer}>
      <div className={classes.titleRow}>
        <strong>{selectedSnap.snap.name}</strong>
        <Button
          type="button"
          appearance="base"
          className={classes.deleteButton}
          aria-label={`Delete ${selectedSnap.snap.name}`}
          onClick={onDelete}
        >
          <Icon name={ICONS.delete} />
        </Button>
      </div>
      <span className="u-text--muted">
        {scope} on {selectedSnap.computerCount} of{" "}
        {pluralize(selectedInstances, ["instance"], "exact")}
      </span>
    </li>
  );
};

export default SnapInstalledItem;
