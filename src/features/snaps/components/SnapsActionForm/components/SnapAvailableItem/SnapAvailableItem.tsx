import { type FC } from "react";
import type { SelectedSnaps } from "../../../../types";
import classes from "./SnapAvailableItem.module.scss";
import classNames from "classnames";
import { Button, Icon, ICONS } from "@canonical/react-components";
import { pluralize } from "@/utils/_helpers";

interface SnapAvailableItemProps {
  readonly selectedSnap: SelectedSnaps;
  readonly onDelete: () => void;
}

const SnapAvailableItem: FC<SnapAvailableItemProps> = ({
  onDelete,
  selectedSnap,
}) => {
  return (
    <li
      className={classNames("u-no-margin--bottom", classes.selectedContainer)}
      key={selectedSnap.snap.id}
    >
      <div>
        <div className="font-monospace">
          {selectedSnap.snap.name} {selectedSnap.channel}
        </div>
        <div className="u-text--muted p-text--small u-no-margin">
          Available on{" "}
          {pluralize(selectedSnap.computers.count, ["instance"], "exact")}
        </div>
      </div>
      <Button
        type="button"
        appearance="link"
        className="u-no-margin--bottom u-no-padding--top"
        aria-label={`Delete ${selectedSnap.snap.name}`}
        onClick={onDelete}
      >
        <Icon name={ICONS.delete} />
      </Button>
    </li>
  );
};

export default SnapAvailableItem;
