import { type FC } from "react";
import type { Package } from "../../../../types";
import classes from "./PackageDropdownSearchItem.module.scss";
import classNames from "classnames";
import { Button, Icon, ICONS, Tooltip } from "@canonical/react-components";
import { pluralize } from "@/utils/_helpers";

interface PackageDropdownSearchItemProps {
  readonly selectedPackage: Package;
  readonly onDelete: () => void;
}

const PackageDropdownSearchItem: FC<PackageDropdownSearchItemProps> = ({
  onDelete,
  selectedPackage,
}) => {
  return (
    <li
      className={classNames("u-no-margin--bottom", classes.selectedContainer)}
      key={selectedPackage.id}
    >
      <div>
        <div className="font-monospace">
          {selectedPackage.name} {selectedPackage.version}
        </div>
        <div className="u-text--muted p-text--small u-no-margin">
          Available on{" "}
          {pluralize(selectedPackage.computers.count, ["instance"], "exact")}
        </div>
      </div>
      <Tooltip message="Remove" position="top-center">
        <Button
          type="button"
          appearance="base"
          className={classes.deleteButton}
          aria-label={`Delete ${selectedPackage.name}`}
          onClick={onDelete}
        >
          <Icon name={ICONS.delete} />
        </Button>
      </Tooltip>
    </li>
  );
};

export default PackageDropdownSearchItem;
