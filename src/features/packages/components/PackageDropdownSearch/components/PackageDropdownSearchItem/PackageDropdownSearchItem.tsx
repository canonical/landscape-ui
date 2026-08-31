import { type FC } from "react";
import type { Package } from "../../../../types";
import classes from "./PackageDropdownSearchItem.module.scss";
import classNames from "classnames";
import { Button, Icon, ICONS } from "@canonical/react-components";
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
      <Button
        type="button"
        appearance="link"
        className="u-no-margin--bottom u-no-padding--top"
        aria-label={`Delete ${selectedPackage.name}`}
        onClick={onDelete}
      >
        <Icon name={ICONS.delete} />
      </Button>
    </li>
  );
};

export default PackageDropdownSearchItem;
