import { HTMLProps } from "react";
import { Cell, TableCellProps } from "react-table";
import { Package, UpgradeInstancePackagesParams } from "@/features/packages";
import { toggleCurrentPackage } from "../helpers";
import { EMPTY_PACKAGE } from "./constants";
import classes from "./AffectedPackages.module.scss";

export const handleCellProps =
  (expandedRow: number, loading: boolean, lastPackageIndex: number) =>
  ({ column, row: { index, original } }: Cell<Package>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (
      (loading && index === lastPackageIndex) ||
      (expandedRow > -1 && expandedRow === index - 1)
    ) {
      if (column.id === "name") {
        cellProps.colSpan = 3;
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
  pkg: Package,
  excludedPackages: UpgradeInstancePackagesParams[],
) => {
  return !pkg.computers.some((instance) =>
    excludedPackages
      .find(({ id }) => id === instance.id)
      ?.exclude_packages.includes(pkg.name),
  );
};

export const areAllPackagesNeedToUpdate = (
  packages: Package[],
  excludedPackages: UpgradeInstancePackagesParams[],
) => {
  return (
    packages.length > 0 &&
    packages.every(({ computers, name }) =>
      excludedPackages
        .filter(({ id }) => computers.some((instance) => instance.id === id))
        .every(({ exclude_packages }) => !exclude_packages.includes(name)),
    )
  );
};

export const getToggledPackages = (
  excludedPackages: UpgradeInstancePackagesParams[],
  packages: Package[],
  isUpdateRequired: boolean,
) => {
  return packages.reduce(
    (acc, pkg) => toggleCurrentPackage(acc, pkg, isUpdateRequired),
    excludedPackages,
  );
};

export const getPackagesData = (
  packages: Package[],
  expandedRow: number,
  isPackagesLoading: boolean,
) => {
  if (expandedRow !== -1) {
    return [
      ...packages.slice(0, expandedRow + 1),
      ...packages.slice(expandedRow),
      ...[EMPTY_PACKAGE].slice(isPackagesLoading ? 0 : 1),
    ];
  }

  return isPackagesLoading ? [...packages, EMPTY_PACKAGE] : packages;
};
