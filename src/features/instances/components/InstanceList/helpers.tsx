import { ColumnFilterOption } from "@/components/form/ColumnFilter";
import { InstanceColumn } from "./types";
import { Instance } from "@/types/Instance";
import { HTMLProps, ReactNode } from "react";
import { STATUSES } from "@/features/instances";
import classes from "./InstanceList.module.scss";
import { Icon, Tooltip } from "@canonical/react-components";
import {
  HeaderGroup,
  TableHeaderProps,
} from "@canonical/react-components/node_modules/@types/react-table";
import NoData from "@/components/layout/NoData";

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

export const getUpgradesCellIconAndLabel = (instance: Instance) => {
  if (!instance.distribution || !/\d{1,2}\.\d{2}/.test(instance.distribution)) {
    return {
      icon: "",
      label: <NoData />,
    };
  }

  if (
    !instance.upgrades ||
    (!instance.upgrades.security && !instance.upgrades.regular)
  ) {
    return {
      icon: STATUSES.UpToDate.icon.color,
      label: STATUSES.UpToDate.label,
    };
  }

  if (!instance.upgrades.security) {
    return {
      icon: STATUSES.PackageUpgradesAlert.icon.color,
      label: (
        <>
          {instance.upgrades.regular} regular{" "}
          {instance.upgrades.regular === 1 ? "upgrade" : "upgrades"}
        </>
      ),
    };
  }

  if (!instance.upgrades.regular) {
    return {
      icon: STATUSES.SecurityUpgradesAlert.icon.color,
      label: (
        <>
          {instance.upgrades.security} security{" "}
          {instance.upgrades.security === 1 ? "upgrade" : "upgrades"}
        </>
      ),
    };
  }

  const label = `${instance.upgrades.security} security, ${instance.upgrades.regular} regular ${instance.upgrades.regular === 1 ? "upgrade" : "upgrades"}`;
  return {
    icon: STATUSES.SecurityUpgradesAlert.icon.color,
    label: <>{label}</>,
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
