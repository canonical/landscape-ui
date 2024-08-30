import { HTMLProps } from "react";
import { Cell, TableCellProps } from "react-table";
import { InstancePackagesToExclude, Package } from "@/features/packages";
import { checkIsPackageUpdateRequired, toggleCurrentPackage } from "../helpers";
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

export const checkIsUpdateRequired = (
  excludedPackages: InstancePackagesToExclude[],
  packages: Package[],
) => {
  return packages.some((pkg) =>
    checkIsPackageUpdateRequired(excludedPackages, pkg),
  );
};

export const checkIsUpdateRequiredForAllVisiblePackages = (
  excludedPackages: InstancePackagesToExclude[],
  packages: Package[],
) => {
  return (
    packages.length > 0 &&
    packages.every(({ computers, id }) =>
      excludedPackages
        .filter(({ id }) => computers.some((instance) => instance.id === id))
        .every(({ exclude_packages }) => !exclude_packages.includes(id)),
    )
  );
};

export const getToggledPackages = (
  excludedPackages: InstancePackagesToExclude[],
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
