import type { HTMLProps } from "react";
import type { Cell, TableCellProps } from "react-table";
import type { InstancePackagesToExclude, Package } from "@/features/packages";
import { checkIsPackageUpdateRequired, toggleCurrentPackage } from "../helpers";
import { EMPTY_PACKAGE } from "./constants";
import classes from "./AffectedPackages.module.scss";

export const handleCellProps =
  ({
    isPackagesLoading,
    lastPackageIndex,
    showSelectAllButton,
  }: {
    isPackagesLoading: boolean;
    lastPackageIndex: number;
    showSelectAllButton: boolean;
  }) =>
  ({ column, row: { index, original } }: Cell<Package>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (
      (showSelectAllButton && index === 0) ||
      (isPackagesLoading && index === lastPackageIndex)
    ) {
      if (column.id === "name") {
        cellProps.colSpan = 3;
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
    packages.every(({ id }) =>
      excludedPackages.every(
        ({ exclude_packages }) => !exclude_packages.includes(id),
      ),
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

export const getPackagesData = ({
  isPackagesLoading,
  packages,
  showSelectAllButton,
}: {
  isPackagesLoading: boolean;
  packages: Package[];
  showSelectAllButton: boolean;
}) => {
  return [
    ...[EMPTY_PACKAGE].slice(showSelectAllButton ? 0 : 1),
    ...packages,
    ...[EMPTY_PACKAGE].slice(isPackagesLoading ? 0 : 1),
  ];
};
