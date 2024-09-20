import { HTMLProps } from "react";
import {
  Cell,
  TableCellProps,
} from "@canonical/react-components/node_modules/@types/react-table";
import { InstancePackage } from "../../types";
import classes from "./PackageList.module.scss";

export const isUbuntuProRequired = (pkg: InstancePackage) => {
  return (
    !!pkg.available_version &&
    !!pkg.current_version &&
    pkg.available_version.includes("ubuntu-pro")
  );
};

export const getPackageStatusInfo = (pkg: InstancePackage) => {
  const pkgStatusInfo = {
    label: "Unknown",
    icon: "",
  };

  if (pkg.status === "available") {
    pkgStatusInfo.label = "Available";
    pkgStatusInfo.icon = "status-queued-small";
  } else if (pkg.status === "held") {
    pkgStatusInfo.label = "Held";
    pkgStatusInfo.icon = "status-in-progress-small";
  } else if (pkg.status === "security") {
    pkgStatusInfo.label = "Security upgrade";
    pkgStatusInfo.icon = "status-failed-small";
  } else if (pkg.status === "installed") {
    if (pkg.available_version) {
      pkgStatusInfo.label = "Regular upgrade";
      pkgStatusInfo.icon = "status-waiting-small";
    } else {
      pkgStatusInfo.label = "Installed";
      pkgStatusInfo.icon = "status-succeeded-small";
    }
  }

  return pkgStatusInfo;
};

export const handleCellProps = ({ column, row }: Cell<InstancePackage>) => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  if (row.original.name === "loading") {
    if (column.id === "name") {
      cellProps.colSpan = 5;
    } else {
      cellProps.className = classes.hidden;
      cellProps["aria-hidden"] = true;
    }
  } else if (column.id === "checkbox") {
    cellProps["aria-label"] = `Toggle ${row.original.name} package`;
  } else if (column.id === "name") {
    cellProps.role = "rowheader";
  } else if (column.id === "status") {
    cellProps["aria-label"] = "Status";
  } else if (column.id === "current_version") {
    cellProps["aria-label"] = "Current version";
  } else if (column.id === "available_version") {
    cellProps["aria-label"] = "Available version";
  } else if (column.id === "summary") {
    cellProps["aria-label"] = "Details";
  }

  return cellProps;
};
