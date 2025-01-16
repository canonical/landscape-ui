import classNames from "classnames";
import moment from "moment";
import { FC, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CellProps,
  Column,
  Row,
} from "@canonical/react-components/node_modules/@types/react-table";
import { CheckboxInput, ModularTable } from "@canonical/react-components";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT, ROOT_PATH } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import { Instance } from "@/types/Instance";
import classes from "./InstanceList.module.scss";
import { ColumnFilterOption } from "@/components/form/ColumnFilter";
import {
  getCheckboxState,
  getColumnFilterOptions,
  getStatusCellIconAndLabel,
  getUpgradesCellIconAndLabel,
  handleCheckboxChange,
  handleHeaderProps,
} from "./helpers";
import { InstanceColumn } from "./types";

interface InstanceListProps {
  instances: Instance[];
  selectedInstances: Instance[];
  setColumnFilterOptions: (options: ColumnFilterOption[]) => void;
  setSelectedInstances: (instances: Instance[]) => void;
}

const InstanceList: FC<InstanceListProps> = ({
  instances,
  selectedInstances,
  setColumnFilterOptions,
  setSelectedInstances,
}) => {
  const { disabledColumns, groupBy, ...filters } = usePageParams();

  const isFilteringInstances = Object.values(filters).some((filter) => {
    if (typeof filter === "string") {
      return filter.length > 0;
    } else if (Array.isArray(filter)) {
      return filter.length > 0;
    }
  });

  const toggleAll = () => {
    setSelectedInstances(selectedInstances.length !== 0 ? [] : instances);
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

  const columns = useMemo<InstanceColumn[]>(
    () => [
      {
        accessor: "title",
        canBeHidden: false,
        optionLabel: "Instance name",
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
            <span id="column-1-label">Name</span>
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
              checked={
                getCheckboxState({
                  groupBy,
                  instance: row.original,
                  selectedInstances,
                }) === "checked"
              }
              indeterminate={
                getCheckboxState({
                  groupBy,
                  instance: row.original,
                  selectedInstances,
                }) === "indeterminate"
              }
              onChange={() => {
                handleCheckboxChange({
                  groupBy,
                  instance: row.original,
                  selectedInstances,
                  setSelectedInstances,
                });
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
        canBeHidden: true,
        optionLabel: "Status",
        Header: "Status",
        Cell: ({ row: { original } }: CellProps<Instance>) => {
          const { label } = getStatusCellIconAndLabel(original);
          return label;
        },
        getCellIcon: ({ row: { original } }) => {
          const { icon } = getStatusCellIconAndLabel(original);
          return icon;
        },
      },
      {
        accessor: "upgrades",
        canBeHidden: true,
        optionLabel: "Upgrades",
        Header: "Upgrades",
        Cell: ({ row: { original } }: CellProps<Instance>) => {
          const { label } = getUpgradesCellIconAndLabel(original);
          return label;
        },
        getCellIcon: ({ row: { original } }: CellProps<Instance>) => {
          const { icon } = getUpgradesCellIconAndLabel(original);
          return icon;
        },
      },
      {
        accessor: "os",
        canBeHidden: true,
        optionLabel: "OS",
        Header: "OS",
        Cell: ({ row: { original } }: CellProps<Instance>) => (
          <>{original.distribution_info?.description ?? <NoData />}</>
        ),
      },
      {
        accessor: "availability_zone",
        canBeHidden: true,
        optionLabel: "Availability zone",
        Header: "Availability zone",
        Cell: ({ row: { original } }: CellProps<Instance>) => (
          <>{original.cloud_init?.availability_zone ?? <NoData />}</>
        ),
      },
      {
        accessor: "ubuntu_pro",
        canBeHidden: true,
        optionLabel: "Ubuntu pro",
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
        canBeHidden: true,
        optionLabel: "Last ping",
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
    ],
    [selectedInstances.length, instances, groupBy],
  );

  useEffect(() => {
    setColumnFilterOptions(getColumnFilterOptions(columns));
  }, []);

  const filteredColumns = useMemo<Column<Instance>[]>(
    () =>
      columns.filter(
        ({ accessor }) =>
          typeof accessor === "string" && !disabledColumns.includes(accessor),
      ),
    [disabledColumns.length, columns],
  );

  return (
    <ModularTable
      emptyMsg={
        isFilteringInstances
          ? "No instances found according to your search parameters."
          : "No instances found"
      }
      columns={filteredColumns}
      data={instancesData}
      getHeaderProps={handleHeaderProps}
    />
  );
};

export default InstanceList;
