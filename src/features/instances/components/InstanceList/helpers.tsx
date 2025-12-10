import type { ColumnFilterOption } from "@/components/form/ColumnFilter";
import NoData from "@/components/layout/NoData";
import { DETAILED_UPGRADES_VIEW_ENABLED } from "@/constants";
import { getAlertStatus } from "@/features/alert-notifications";
import type { Instance, InstanceWithoutRelation } from "@/types/Instance";
import { hasOneItem, pluralize } from "@/utils/_helpers";
import { Icon, Tooltip } from "@canonical/react-components";
import type { HTMLProps, ReactNode } from "react";
import type {
  Cell,
  HeaderGroup,
  Row,
  TableCellProps,
  TableHeaderProps,
  TableRowProps,
} from "react-table";
import { ALERT_STATUSES } from "../../constants";
import {
  getFeatures,
  hasRegularUpgrades,
  hasSecurityUpgrades,
} from "../../helpers";
import classes from "./InstanceList.module.scss";
import type { GetUpgradesResult, InstanceColumn } from "./types";

export const getColumnFilterOptions = (
  columns: InstanceColumn[],
): ColumnFilterOption[] => {
  return columns.map(({ accessor, canBeHidden, optionLabel }) => ({
    canBeHidden,
    label: optionLabel,
    value: accessor,
  }));
};

interface FigureCheckboxStateParams {
  instance: Instance;
  selectedInstances: Instance[];
}

export const getCheckboxState = ({
  instance,
  selectedInstances,
}: FigureCheckboxStateParams) => {
  const selectedInstancesIds = selectedInstances.map(({ id }) => id);
  return selectedInstancesIds.includes(instance.id) ? "checked" : "unchecked";
};

interface HandleCheckboxChangeParams {
  instance: Instance;
  selectedInstances: Instance[];
  setSelectedInstances: (instances: Instance[]) => void;
}

export const handleCheckboxChange = ({
  instance,
  selectedInstances,
  setSelectedInstances,
}: HandleCheckboxChangeParams) => {
  if (selectedInstances.some(({ id }) => id === instance.id)) {
    setSelectedInstances(
      selectedInstances.filter(({ id }) => id !== instance.id),
    );
  } else {
    setSelectedInstances([...selectedInstances, instance]);
  }
};

export const getStatusCellIconAndLabel = (
  instance: InstanceWithoutRelation,
): { label: ReactNode; icon?: string } => {
  if (instance.archived) {
    return {
      icon: "archive",
      label: "Archived",
    };
  }

  const filteredAlerts = (instance.alerts ?? []).filter(
    ({ type }) =>
      !["PackageUpgradesAlert", "SecurityUpgradesAlert"].includes(type),
  );

  if (0 === filteredAlerts.length) {
    return {
      icon: `${ALERT_STATUSES.Online.icon.color}`,
      label:
        ALERT_STATUSES.Online.alternateLabel ?? ALERT_STATUSES.Online.label,
    };
  }

  if (hasOneItem(filteredAlerts)) {
    return {
      icon: getAlertStatus(filteredAlerts[0].type).icon.color,
      label: <>{filteredAlerts[0].summary}</>,
    };
  }

  return {
    label: (
      <span className={classes.statusContainer}>
        {filteredAlerts.map(({ type, summary }) => {
          const alertStatus = getAlertStatus(type);

          return (
            <span className={classes.statusListItem} key={type}>
              <Tooltip message={summary}>
                <Icon
                  className="u-no-margin--left"
                  name={alertStatus.icon.color ?? alertStatus.icon.gray}
                />
              </Tooltip>
            </span>
          );
        })}
      </span>
    ),
  };
};

const getUpgradesFromAlerts = (
  alerts: Instance["alerts"],
): GetUpgradesResult => {
  return {
    regular: hasRegularUpgrades(alerts)
      ? {
          icon: ALERT_STATUSES.PackageUpgradesAlert.icon.color ?? "",
          label: ALERT_STATUSES.PackageUpgradesAlert.label,
        }
      : false,
    security: hasSecurityUpgrades(alerts)
      ? {
          icon: ALERT_STATUSES.SecurityUpgradesAlert.icon.color ?? "",
          label: ALERT_STATUSES.SecurityUpgradesAlert.label,
        }
      : false,
  };
};

const getUpgradesFromUpgrades = (
  upgrades: Instance["upgrades"],
): GetUpgradesResult => {
  if (!upgrades) {
    return { regular: false, security: false };
  }

  return {
    regular: upgrades.regular
      ? {
          icon: ALERT_STATUSES.PackageUpgradesAlert.icon.color ?? "",
          label: `${upgrades.regular} regular ${pluralize(upgrades.regular, "upgrade")}`,
        }
      : false,
    security: upgrades.security
      ? {
          icon: ALERT_STATUSES.SecurityUpgradesAlert.icon.color ?? "",
          label: `${upgrades.security} security ${pluralize(upgrades.security, "upgrade")}`,
        }
      : false,
  };
};

export const getUpgradesCellIconAndLabel = (instance: Instance) => {
  if (!getFeatures(instance).packages) {
    return {
      icon: "",
      label: <NoData />,
    };
  }

  const { regular, security } = DETAILED_UPGRADES_VIEW_ENABLED
    ? getUpgradesFromUpgrades(instance.upgrades)
    : getUpgradesFromAlerts(instance.alerts);

  if (regular && security) {
    return {
      icon: security.icon,
      label: `${regular.label}, ${security.label.toLowerCase()}`,
    };
  }

  if (regular) {
    return {
      icon: regular.icon,
      label: regular.label,
    };
  }

  if (security) {
    return {
      icon: security.icon,
      label: security.label,
    };
  }

  return {
    icon: ALERT_STATUSES.UpToDate.icon.color,
    label: ALERT_STATUSES.UpToDate.label,
  };
};

export const handleHeaderProps = ({ id }: HeaderGroup<Instance>) => {
  const headerProps: Partial<
    TableHeaderProps & HTMLProps<HTMLTableCellElement>
  > = {};

  if (id === "title") {
    headerProps["aria-labelledby"] = "column-1-label";
  }

  return headerProps;
};

export const getCellProps = (expandedRowIndex: number | null) => {
  return ({
    column,
    row: { index },
  }: Cell<Instance>): Partial<
    TableCellProps & HTMLProps<HTMLTableCellElement>
  > => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    switch (column.id) {
      case "title":
        cellProps.role = "rowheader";
        break;
      case "status":
        cellProps["aria-label"] = "Status";
        break;
      case "upgrades":
        cellProps["aria-label"] = "Upgrades";
        break;
      case "os":
        cellProps["aria-label"] = "Operating system";
        break;
      case "tags":
        cellProps["aria-label"] = "Tags";
        if (expandedRowIndex === index) {
          cellProps.className = "expandedCell";
        }
        break;
      case "availability_zone":
        cellProps["aria-label"] = "Availability zone";
        break;
      case "ubuntu_pro":
        cellProps["aria-label"] = "Ubuntu Pro expiration date";
        break;
      case "last_ping":
        cellProps["aria-label"] = "Last ping";
        break;
      case "actions":
        cellProps["aria-label"] = "Actions";
        break;
    }

    return cellProps;
  };
};

export const getRowProps = (expandedRowIndex: number | null) => {
  return ({
    index,
    original,
  }: Row<Instance>): Partial<
    TableRowProps & HTMLProps<HTMLTableRowElement>
  > => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (expandedRowIndex === index) {
      rowProps.className = "expandedRow";
    }
    rowProps["aria-label"] = `${original.title} instance row`;

    return rowProps;
  };
};
