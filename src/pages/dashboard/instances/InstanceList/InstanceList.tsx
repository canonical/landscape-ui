import classNames from "classnames";
import moment from "moment";
import { FC, ReactNode, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CellProps,
  Column,
  Row,
} from "@canonical/react-components/node_modules/@types/react-table";
import {
  CheckboxInput,
  Icon,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT, ROOT_PATH } from "@/constants";
import { STATUSES } from "@/features/instances";
import { usePageParams } from "@/hooks/usePageParams";
import { Instance } from "@/types/Instance";
import classes from "./InstanceList.module.scss";

interface InstanceListProps {
  instances: Instance[];
  selectedInstances: Instance[];
  setSelectedInstances: (instances: Instance[]) => void;
  groupBy: string;
}

const InstanceList: FC<InstanceListProps> = ({
  instances,
  selectedInstances,
  setSelectedInstances,
  groupBy,
}) => {
  const { disabledColumns } = usePageParams();

  const toggleAll = () => {
    setSelectedInstances(selectedInstances.length !== 0 ? [] : instances);
  };

  const handleChange = (row: Row<Instance>) => {
    if (groupBy === "parent" && row.original.children.length > 0) {
      const childrenIds = row.original.children.map(({ id }) => id);

      if (selectedInstances.some(({ id }) => childrenIds.includes(id))) {
        setSelectedInstances(
          selectedInstances.filter(({ id }) => !childrenIds.includes(id)),
        );
      } else {
        setSelectedInstances([
          ...selectedInstances,
          ...row.original.children.map((child) => ({
            ...child,
            parent: row.original,
            children: [],
          })),
        ]);
      }
    } else {
      if (selectedInstances.some(({ id }) => id === row.original.id)) {
        setSelectedInstances(
          selectedInstances.filter(({ id }) => id !== row.original.id),
        );
      } else {
        setSelectedInstances([...selectedInstances, row.original]);
      }
    }
  };

  const instancesData = useMemo(() => {
    return groupBy === "parent"
      ? instances.map((instance) => ({
          ...instance,
          subRows: instance.children.map((child) => ({
            ...child,
            parent: instance,
            children: [],
          })),
        }))
      : instances;
  }, [instances, groupBy]);

  const figureCheckboxState = (instance: Instance) => {
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

      return instance.children.some(({ id }) =>
        selectedInstancesIds.includes(id),
      )
        ? "indeterminate"
        : "unchecked";
    }

    return selectedInstancesIds.includes(instance.id) ? "checked" : "unchecked";
  };

  const getUpgradesRowIconAndLabel = (instance: Instance) => {
    if (
      !instance.distribution ||
      !/\d{1,2}\.\d{2}/.test(instance.distribution)
    ) {
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
    } else if (!instance.upgrades.security) {
      return {
        icon: STATUSES.PackageUpgradesAlert.icon.color,
        label: (
          <>
            {instance.upgrades.regular} regular{" "}
            {instance.upgrades.regular === 1 ? "upgrade" : "upgrades"}
          </>
        ),
      };
    } else if (!instance.upgrades.regular) {
      return {
        icon: STATUSES.SecurityUpgradesAlert.icon.color,
        label: (
          <>
            {instance.upgrades.security} security{" "}
            {instance.upgrades.security === 1 ? "upgrade" : "upgrades"}
          </>
        ),
      };
    } else {
      const label = `${instance.upgrades.security} security, ${instance.upgrades.regular} regular ${instance.upgrades.regular === 1 ? "upgrade" : "upgrades"}`;
      return {
        icon: STATUSES.SecurityUpgradesAlert.icon.color,
        label: <>{label}</>,
      };
    }
  };

  const getStatusRowIconAndLabel = (
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

  const columns = useMemo<Column<Instance>[]>(
    () =>
      [
        {
          accessor: "title",
          Header: (
            <>
              <CheckboxInput
                label={
                  <span className="u-off-screen">Toggle all instances</span>
                }
                inline
                onChange={toggleAll}
                disabled={instances.length === 0}
                checked={
                  selectedInstances.length === instances.length &&
                  instances.length !== 0
                }
                indeterminate={
                  selectedInstances.length !== 0 &&
                  selectedInstances.length < instances.length
                }
              />
              <span>Name</span>
            </>
          ),
          Cell: ({ row }: CellProps<Instance>) => (
            <div
              className={classNames(classes.rowHeader, {
                [classes.nested]:
                  (row as Row<Instance> & { depth: number }).depth > 0,
              })}
            >
              <CheckboxInput
                label={
                  <span className="u-off-screen">{row.original.title}</span>
                }
                labelClassName="u-no-margin--bottom u-no-padding--top"
                checked={figureCheckboxState(row.original) === "checked"}
                indeterminate={
                  figureCheckboxState(row.original) === "indeterminate"
                }
                onChange={() => {
                  handleChange(row);
                }}
              />
              <Link
                to={
                  row.original.parent
                    ? `${ROOT_PATH}instances/${row.original.parent.id}/${row.original.id}`
                    : `${ROOT_PATH}instances/${row.original.id}`
                }
              >
                {row.original.title}
              </Link>
            </div>
          ),
        },
        {
          accessor: "status",
          Header: "Status",
          Cell: ({ row: { original } }: CellProps<Instance>) => {
            const { label } = getStatusRowIconAndLabel(original);
            return label;
          },
          getCellIcon: ({ row: { original } }: CellProps<Instance>) => {
            const { icon } = getStatusRowIconAndLabel(original);
            return icon;
          },
        },
        {
          accessor: "upgrades",
          Header: "Upgrades",
          Cell: ({ row: { original } }: CellProps<Instance>) => {
            const { label } = getUpgradesRowIconAndLabel(original);
            return label;
          },
          getCellIcon: ({ row: { original } }: CellProps<Instance>) => {
            const { icon } = getUpgradesRowIconAndLabel(original);
            return icon;
          },
        },
        {
          accessor: "os",
          Header: "OS",
          Cell: ({ row: { original } }: CellProps<Instance>) => (
            <>{original.distribution_info.description ?? <NoData />}</>
          ),
        },
        {
          accessor: "availability_zone",
          Header: "Availability zone",
          Cell: ({ row: { original } }: CellProps<Instance>) => (
            <>{original.cloud_init?.availability_zone ?? <NoData />}</>
          ),
        },
        {
          accessor: "ubuntu_pro",
          Header: "Ubuntu pro",
          Cell: ({ row }: CellProps<Instance>) => (
            <>
              {row.original.ubuntu_pro_info &&
              moment(row.original.ubuntu_pro_info.expires).isValid() ? (
                `Exp. ${moment(row.original.ubuntu_pro_info.expires).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )}`
              ) : (
                <NoData />
              )}
            </>
          ),
        },
        {
          accessor: "last_ping",
          Header: "Last ping time",
          Cell: ({ row }: CellProps<Instance>) => (
            <>
              {moment(row.original.last_ping_time).isValid() ? (
                moment(row.original.last_ping_time).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )
              ) : (
                <NoData />
              )}
            </>
          ),
        },
      ].filter(
        ({ accessor }) => accessor && !disabledColumns.includes(accessor),
      ),
    [disabledColumns.length, selectedInstances.length, instances, groupBy],
  );

  return (
    <ModularTable
      emptyMsg="No instances found according to your search parameters."
      columns={columns}
      data={instancesData}
    />
  );
};

export default InstanceList;
