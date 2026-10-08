import type { HTMLProps } from "react";
import type { Cell, TableCellProps } from "react-table";
import type { InstancePackage } from "@/features/packages";
import classes from "./AffectedPackages.module.scss";

export const handleCellProps =
  ({
    lastPackageIndex,
    loading,
    showToggle,
  }: {
    lastPackageIndex: number;
    loading: boolean;
    showToggle: boolean;
  }) =>
  ({ column, row: { index } }: Cell<InstancePackage>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (
      (showToggle && index === 0) ||
      (loading && index === lastPackageIndex)
    ) {
      if (column.id === "checkbox") {
        cellProps.colSpan = 5;
      } else {
        cellProps.className = classes.hidden;
        cellProps["aria-hidden"] = true;
      }
    }

    return cellProps;
  };

export const getPackageData = (
  packages: InstancePackage[],
  showSelectAllButton: boolean,
  packagesLoading: boolean,
) => {
  return [
    ...packages.slice(showSelectAllButton ? -1 : packages.length),
    ...packages,
    ...packages.slice(packagesLoading ? -1 : packages.length),
  ];
};

export const getToggleAllCheckboxState = (
  instanceExcludedPackages: number[],
  packages: InstancePackage[],
) => {
  const excludedPackageIdSet = new Set(instanceExcludedPackages);

  const selectedPackageCount = packages.filter(
    ({ id }) => !excludedPackageIdSet.has(id),
  ).length;

  if (selectedPackageCount === 0) {
    return "unchecked";
  }

  return selectedPackageCount === packages.length ? "checked" : "indeterminate";
};
