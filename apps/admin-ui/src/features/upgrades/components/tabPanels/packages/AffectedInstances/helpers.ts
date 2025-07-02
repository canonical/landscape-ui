import type { HTMLProps } from "react";
import type { Cell, TableCellProps } from "react-table";
import type { InstancePackagesToExclude, Package } from "@/features/packages";
import type { Instance } from "@/types/Instance";
import { toggleCurrentPackage } from "../helpers";

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

export const getToggleAllCheckboxState = ({
  excludePackages,
  instances,
  limit,
  pkg,
}: {
  excludePackages: InstancePackagesToExclude[];
  instances: Instance[];
  limit: number;
  pkg: Package;
}) => {
  const instanceIdSet = new Set(pkg.computers.map(({ id }) => id));
  const shownInstance = instances
    .filter(({ id }) => instanceIdSet.has(id))
    .slice(0, limit);

  const excludedInstanceIdSet = new Set(
    excludePackages
      .filter(({ exclude_packages }) => exclude_packages.includes(pkg.id))
      .map(({ id }) => id),
  );

  const selectedPackageCount = shownInstance.filter(
    ({ id }) => !excludedInstanceIdSet.has(id),
  ).length;

  if (selectedPackageCount === 0) {
    return "unchecked";
  }

  return selectedPackageCount === shownInstance.length
    ? "checked"
    : "indeterminate";
};

export const getSelectedInstanceCount = (
  excludePackages: InstancePackagesToExclude[],
  pkg: Package,
) => {
  const instanceSet = new Set(pkg.computers.map(({ id }) => id));

  return excludePackages.filter(
    ({ exclude_packages, id }) =>
      instanceSet.has(id) && !exclude_packages.includes(pkg.id),
  ).length;
};

export const getSelectedPackage = (
  excludePackages: InstancePackagesToExclude[],
  pkg: Package,
) => {
  return toggleCurrentPackage(excludePackages, pkg, false);
};
