import { InstancePackagesToExclude } from "@/features/packages";
import { Cell, TableCellProps } from "react-table";
import { HTMLProps } from "react";
import { Instance } from "@/types/Instance";

export const getCellProps =
  (showSelectAllButton: boolean) =>
  ({ column, row }: Cell<Instance>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (showSelectAllButton && row.index === 0) {
      if (column.id === "checkbox") {
        cellProps.colSpan = 4;
      } else {
        cellProps.style = cellProps.style || {};
        cellProps.style.display = "none";
        cellProps["aria-hidden"] = true;
      }
    } else if (column.id === "checkbox") {
      cellProps["aria-label"] = `Toggle ${row.original.name} instance`;
    } else if (column.id === "title") {
      cellProps.role = "rowheader";
    } else if (column.id === "current_version") {
      cellProps["aria-label"] = "Current version";
    } else if (column.id === "available_version") {
      cellProps["aria-label"] = "New version";
    }

    return cellProps;
  };

export const checkIsPackageUpdateRequiredForInstance = (
  excludedPackages: InstancePackagesToExclude[],
  instanceId: number,
  packageId: number,
) => {
  return !excludedPackages
    .find(({ id }) => id === instanceId)
    ?.exclude_packages.includes(packageId);
};

export const getToggledInstance = (
  excludedPackages: InstancePackagesToExclude[],
  instanceId: number,
  packageId: number,
) => {
  return excludedPackages.map(({ id, exclude_packages }) => {
    if (id !== instanceId) {
      return { id, exclude_packages };
    }

    return {
      id,
      exclude_packages: exclude_packages.includes(packageId)
        ? exclude_packages.filter((packageId) => packageId !== packageId)
        : [...exclude_packages, packageId],
    };
  });
};
