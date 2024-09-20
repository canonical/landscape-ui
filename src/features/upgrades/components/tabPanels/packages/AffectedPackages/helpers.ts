import { HTMLProps } from "react";
import {
  Cell,
  TableCellProps,
} from "@canonical/react-components/node_modules/@types/react-table";
import { InstancePackagesToExclude, Package } from "@/features/packages";
import { checkIsPackageUpdateRequired, toggleCurrentPackage } from "../helpers";
import { EMPTY_PACKAGE } from "./constants";
import classes from "./AffectedPackages.module.scss";

export const handleCellProps =
  ({
    expandedRow,
    isPackagesLoading,
    lastPackageIndex,
    showSelectAllButton,
  }: {
    expandedRow: number;
    isPackagesLoading: boolean;
    lastPackageIndex: number;
    showSelectAllButton: boolean;
  }) =>
  ({ column, row: { index, original } }: Cell<Package>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (
      (showSelectAllButton && index === 0) ||
      (isPackagesLoading && index === lastPackageIndex) ||
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

export const getPackagesData = ({
  expandedRow,
  isPackagesLoading,
  packages,
  showSelectAllButton,
}: {
  expandedRow: number;
  isPackagesLoading: boolean;
  packages: Package[];
  showSelectAllButton: boolean;
}) => {
  const indexToInsert = expandedRow > -1 ? expandedRow + 1 : 0;

  return [
    ...[EMPTY_PACKAGE].slice(showSelectAllButton ? 0 : 1),
    ...packages.slice(0, indexToInsert || packages.length),
    ...packages.slice(indexToInsert ? indexToInsert - 1 : packages.length),
    ...[EMPTY_PACKAGE].slice(isPackagesLoading ? 0 : 1),
  ];
};

export const checkIsPackageUpdateRequiredForAllInstances = (
  excludedPackages: InstancePackagesToExclude[],
  pkg: Package,
) => {
  const instancesIdSet = new Set(pkg.computers.map(({ id }) => id));

  return excludedPackages.every(
    ({ exclude_packages, id }) =>
      !instancesIdSet.has(id) || !exclude_packages.includes(pkg.id),
  );
};
