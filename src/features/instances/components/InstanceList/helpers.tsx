import type { ColumnFilterOption } from "@/components/form/ColumnFilter";
import NoData from "@/components/layout/NoData";
import { DETAILED_UPGRADES_VIEW_ENABLED } from "@/constants";
import { STATUSES } from "@/features/instances";
import type { Instance } from "@/types/Instance";
import { Icon, Tooltip } from "@canonical/react-components";
import type { HTMLProps, ReactNode } from "react";
import type { HeaderGroup, TableHeaderProps } from "react-table";
import {
  currentInstanceIs,
  hasRegularUpgrades,
  hasSecurityUpgrades,
} from "../../helpers";
import classes from "./InstanceList.module.scss";
import type { GetUpgradesResult, InstanceColumn } from "./types";
import { pluralize } from "@/utils/_helpers";

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
  groupBy: string;
  instance: Instance;
  selectedInstances: Instance[];
}

export const getCheckboxState = ({
  groupBy,
  instance,
  selectedInstances,
}: FigureCheckboxStateParams) => {
  const selectedInstancesIds = selectedInstances.map(({ id }) => id);

  if (
    groupBy === "parent" &&
    !instance.is_wsl_instance &&
    instance.children.length > 0
  ) {
    if (
      instance.children.every(({ id }) => selectedInstancesIds.includes(id))
    ) {
      return "checked";
    }

    return instance.children.some(({ id }) => selectedInstancesIds.includes(id))
      ? "indeterminate"
      : "unchecked";
  }

  return selectedInstancesIds.includes(instance.id) ? "checked" : "unchecked";
};

interface HandleCheckboxChangeParams {
  groupBy: string;
  instance: Instance;
  selectedInstances: Instance[];
  setSelectedInstances: (instances: Instance[]) => void;
}

export const handleCheckboxChange = ({
  groupBy,
  instance,
  selectedInstances,
  setSelectedInstances,
}: HandleCheckboxChangeParams) => {
  if (groupBy === "parent" && instance.children.length > 0) {
    const childrenIds = instance.children.map(({ id }) => id);

    if (selectedInstances.some(({ id }) => childrenIds.includes(id))) {
      setSelectedInstances(
        selectedInstances.filter(({ id }) => !childrenIds.includes(id)),
      );
    } else {
      setSelectedInstances([
        ...selectedInstances,
        ...instance.children.map((child) => ({
          ...child,
          parent: instance,
          children: [],
        })),
      ]);
    }
  } else {
    if (selectedInstances.some(({ id }) => id === instance.id)) {
      setSelectedInstances(
        selectedInstances.filter(({ id }) => id !== instance.id),
      );
    } else {
      setSelectedInstances([...selectedInstances, instance]);
    }
  }
};

export const getStatusCellIconAndLabel = (
  instance: Instance,
): { label: ReactNode; icon?: string } => {
  if (instance.archived) {
    return {
      icon: "archive",
      label: "Archived",
    };
  }

  const filteredAlerts = (instance?.alerts ?? []).filter(
    ({ type }) =>
      !["PackageUpgradesAlert", "SecurityUpgradesAlert"].includes(type),
  );

  if (0 === filteredAlerts.length) {
    return {
      icon: `${STATUSES.Online.icon.color}`,
      label: STATUSES.Online.alternateLabel ?? STATUSES.Online.label,
    };
  }

  if (1 === filteredAlerts.length) {
    return {
      icon: `${STATUSES[filteredAlerts[0].type].icon.color ?? STATUSES.Unknown.icon.color}`,
      label: <>{filteredAlerts[0].summary}</>,
    };
  }

  return {
    label: (
      <span className={classes.statusContainer}>
        {filteredAlerts.map(({ type, summary }) => (
          <span className={classes.statusListItem} key={type}>
            <Tooltip message={summary}>
              <Icon
                className="u-no-margin--left"
                name={`${STATUSES[type]?.icon.color ?? STATUSES.Unknown.icon.color}`}
              />
            </Tooltip>
          </span>
        ))}
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
          icon: STATUSES.PackageUpgradesAlert.icon.color ?? "",
          label: STATUSES.PackageUpgradesAlert.label,
        }
      : false,
    security: hasSecurityUpgrades(alerts)
      ? {
          icon: STATUSES.SecurityUpgradesAlert.icon.color ?? "",
          label: STATUSES.SecurityUpgradesAlert.label,
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
          icon: STATUSES.PackageUpgradesAlert.icon.color ?? "",
          label: `${upgrades.regular} regular ${pluralize(upgrades.regular, "upgrade")}`,
        }
      : false,
    security: upgrades.security
      ? {
          icon: STATUSES.SecurityUpgradesAlert.icon.color ?? "",
          label: `${upgrades.security} security ${pluralize(upgrades.security, "upgrade")}`,
        }
      : false,
  };
};

export const getUpgradesCellIconAndLabel = (instance: Instance) => {
  if (!currentInstanceIs("ubuntu", instance)) {
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
    icon: STATUSES.UpToDate.icon.color,
    label: STATUSES.UpToDate.label,
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
