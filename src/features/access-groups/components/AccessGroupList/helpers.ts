import type { Cell, TableCellProps } from "react-table";
import type { HTMLProps } from "react";
import type { AccessGroup, AccessGroupWithInstancesCount } from "../../types";

export const handleCellProps = (cell: Cell<AccessGroupWithInstancesCount>) => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};
  switch (cell.column.id) {
    case "title":
      cellProps.role = "rowheader";
      break;
    case "name":
      cellProps["aria-label"] = "Name";
      break;
    case "instancesCount":
      cellProps["aria-label"] = "Instances count";
      break;
    case "parent":
      cellProps["aria-label"] = "Parent";
      break;
    case "id":
      cellProps["aria-label"] = "Actions";
      break;
  }

  return cellProps;
};

export const findAncestors = (
  groupName: string,
  allGroups: AccessGroup[],
): AccessGroup[] => {
  const parentGroup = allGroups.find((group) => group.name === groupName);
  if (parentGroup && parentGroup.parent) {
    return [parentGroup, ...findAncestors(parentGroup.parent, allGroups)];
  }
  return parentGroup ? [parentGroup] : [];
};

export const buildHierarchy = (
  parentName: string,
  allGroups: AccessGroup[],
): AccessGroupWithInstancesCount[] => {
  return allGroups
    .filter((group) => group.parent === parentName)
    .map((child) => ({
      ...child,
      instancesCount: 0,
      subRows: buildHierarchy(child.name, allGroups),
    }));
};
