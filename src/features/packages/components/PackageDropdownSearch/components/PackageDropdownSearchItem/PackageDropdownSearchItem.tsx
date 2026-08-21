import { type FC } from "react";
import type { Package } from "../../../../types";
import classes from "./PackageDropdownSearchItem.module.scss";
import classNames from "classnames";
import { Button, Icon, ICONS } from "@canonical/react-components";
import { pluralize } from "@/utils/_helpers";

interface PackageDropdownSearchItemProps {
  readonly selectedPackage: [Package, number[]];
  readonly onDelete: () => void;
}

const PackageDropdownSearchItem: FC<PackageDropdownSearchItemProps> = ({
  onDelete,
  selectedPackage,
}) => {
  return (
    <li
      className={classNames("u-no-margin--bottom", classes.selectedContainer)}
      key={selectedPackage[0].id}
    >
      <div>
        <div className="font-monospace">
          {selectedPackage[0].name} {selectedPackage[0].version}
        </div>
        <div className="u-text--muted p-text--small u-no-margin">
          Available on{" "}
          {pluralize(selectedPackage[0].computers.count, ["instance"], "exact")}
        </div>
      </div>
      <Button
        type="button"
        appearance="link"
        className="u-no-margin--bottom u-no-padding--top"
        aria-label={`Delete ${selectedPackage[0].name}`}
        onClick={onDelete}
      >
        <Icon name={ICONS.delete} />
      </Button>
    </li>
  );
};

export default PackageDropdownSearchItem;
