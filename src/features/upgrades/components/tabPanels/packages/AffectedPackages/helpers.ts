import { HTMLProps } from "react";
import { Cell, TableCellProps } from "react-table";
import { OldPackage, UpgradeInstancePackagesParams } from "@/features/packages";
import { toggleCurrentPackage } from "../helpers";
import classes from "./AffectedPackages.module.scss";

export const handleCellProps =
  (expandedRow: number, loading: boolean) =>
  ({ column, row: { index, original } }: Cell<OldPackage>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (loading || (expandedRow > -1 && expandedRow === index - 1)) {
      if (column.id === "name") {
        cellProps.colSpan = 5;
        if (expandedRow > -1 && expandedRow === index - 1) {
          cellProps.className = classes.innerTable;
        }
      } else {
        cellProps.className = classes.hidden;
        cellProps["aria-hidden"] = true;
      }
    } else if (column.id === "checkbox") {
      cellProps["aria-label"] = `Toggle ${original.name} package`;
    } else if (column.id === "name") {
      cellProps.role = "rowheader";
    } else if (column.id === "version") {
      cellProps["aria-label"] = "Current version";
    } else if (column.id === "new_version") {
      cellProps["aria-label"] = "New version";
    } else if (column.id === "computers.upgrades") {
      cellProps["aria-label"] = "Affected instances";
      cellProps.className =
        expandedRow === index ? classes.expanded : classes.row;
    }

    return cellProps;
  };

export const areAllInstancesNeedToUpdate = (
  pkg: OldPackage,
  excludedPackages: UpgradeInstancePackagesParams[],
) => {
  return !pkg.computers.upgrades.some((instanceId) =>
    excludedPackages
      .find(({ id }) => id === instanceId)
      ?.exclude_packages.includes(pkg.name),
  );
};

export const areAllPackagesNeedToUpdate = (
  packages: OldPackage[],
  excludedPackages: UpgradeInstancePackagesParams[],
) => {
  return (
    packages.length > 0 &&
    packages.every(({ computers: { upgrades }, name }) =>
      excludedPackages
        .filter(({ id }) => upgrades.includes(id))
        .every(({ exclude_packages }) => !exclude_packages.includes(name)),
    )
  );
};

export const getToggledPackages = (
  excludedPackages: UpgradeInstancePackagesParams[],
  packages: OldPackage[],
  isUpdateRequired: boolean,
) => {
  return packages.reduce(
    (acc, pkg) => toggleCurrentPackage(acc, pkg, isUpdateRequired),
    excludedPackages,
  );
};
