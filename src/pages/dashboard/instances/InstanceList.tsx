import { FC, useMemo } from "react";
import { Instance } from "../../../types/Instance";
import { CheckboxInput, ModularTable } from "@canonical/react-components";
import { CellProps, Column, Row } from "react-table";
import { Link } from "react-router-dom";
import classes from "./InstanceList.module.scss";
import moment from "moment";
import {
  DISPLAY_DATE_FORMAT,
  INPUT_DATE_FORMAT,
  ROOT_PATH,
} from "../../../constants";
import classNames from "classnames";

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
  const toggleAll = () => {
    setSelectedInstances(selectedInstances.length !== 0 ? [] : instances);
  };

  const handleChange = (row: Row<Instance>) => {
    if (groupBy === "parent" && row.original.children.length > 0) {
      const childrenIds = row.original.children.map(({ id }) => id);

      selectedInstances.some(({ id }) => childrenIds.includes(id))
        ? setSelectedInstances(
            selectedInstances.filter(({ id }) => !childrenIds.includes(id)),
          )
        : setSelectedInstances([
            ...selectedInstances,
            ...row.original.children.map((child) => ({
              ...child,
              parent: row.original,
              children: [],
            })),
          ]);
    } else {
      selectedInstances.some(({ id }) => id === row.original.id)
        ? setSelectedInstances(
            selectedInstances.filter(({ id }) => id !== row.original.id),
          )
        : setSelectedInstances([...selectedInstances, row.original]);
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

  const columns = useMemo<Column<Instance>[]>(
    () => [
      {
        accessor: "title",
        Header: (
          <>
            <CheckboxInput
              label={<span className="u-off-screen">Toggle all instances</span>}
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
              label={<span className="u-off-screen">{row.original.title}</span>}
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
                  ? `${ROOT_PATH}instances/${row.original.parent.hostname}/${row.original.hostname}`
                  : `${ROOT_PATH}instances/${row.original.hostname}`
              }
            >
              {row.original.title}
            </Link>
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "reboot_required_flag",
        Cell: ({ row }: CellProps<Instance>) =>
          row.original.reboot_required_flag ? (
            <>Reboot required</>
          ) : (
            <>No action required</>
          ),
        getCellIcon: ({ value }: CellProps<Instance, boolean>) => {
          if (value) {
            return `restart ${classes.restartError}`;
          }

          return false;
        },
      },
      {
        Header: "Upgrades",
      },
      {
        accessor: "distribution",
        Header: "OS",
        Cell: ({ row }: CellProps<Instance>) => (
          <>
            {row.original.distribution.match(/\d{1,2}\.\d{2}/)
              ? `${row.original.is_wsl_instance ? "WSL - " : ""}Ubuntu\xA0${
                  row.original.distribution
                }`
              : `Windows ${row.original.distribution}`}
          </>
        ),
      },
      {
        accessor: "ubuntu_pro_info",
        Header: "Ubuntu pro",
        Cell: ({ row }: CellProps<Instance>) => (
          <>
            {row.original.ubuntu_pro_info &&
            moment(
              row.original.ubuntu_pro_info.expires,
              INPUT_DATE_FORMAT,
            ).isValid()
              ? `Exp. ${moment(
                  row.original.ubuntu_pro_info.expires,
                  INPUT_DATE_FORMAT,
                ).format(DISPLAY_DATE_FORMAT)}`
              : "---"}
          </>
        ),
      },
      {
        Header: "Host name",
        accessor: "hostname",
        Cell: ({ row }: CellProps<Instance>) => <>{row.original.hostname}</>,
      },
      {
        Header: "Last ping time",
        accessor: "last_ping_time",
        Cell: ({ row }: CellProps<Instance>) => (
          <>
            {moment(row.original.last_ping_time, INPUT_DATE_FORMAT).isValid()
              ? moment(row.original.last_ping_time, INPUT_DATE_FORMAT).format(
                  DISPLAY_DATE_FORMAT,
                )
              : "---"}
          </>
        ),
      },
    ],
    [selectedInstances.length, instances, groupBy],
  );

  return (
    <>
      <ModularTable
        emptyMsg="No instances found"
        columns={columns}
        data={instancesData}
      />
    </>
  );
};

export default InstanceList;
