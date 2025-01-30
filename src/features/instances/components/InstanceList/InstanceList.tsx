import type { ColumnFilterOption } from "@/components/form/ColumnFilter";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import type { Instance } from "@/types/Instance";
import { CheckboxInput, ModularTable } from "@canonical/react-components";
import classNames from "classnames";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { Link } from "react-router";
import type { CellProps, Column, Row } from "react-table";
import {
  getCheckboxState,
  getColumnFilterOptions,
  getStatusCellIconAndLabel,
  getUpgradesCellIconAndLabel,
  handleCheckboxChange,
  handleHeaderProps,
} from "./helpers";
import classes from "./InstanceList.module.scss";
import type { InstanceColumn } from "./types";

interface InstanceListProps {
  readonly instances: Instance[];
  readonly selectedInstances: Instance[];
  readonly setColumnFilterOptions: (options: ColumnFilterOption[]) => void;
  readonly setSelectedInstances: (instances: Instance[]) => void;
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
      return filter;
    } else if (Array.isArray(filter)) {
      return filter.length;
    }

    return undefined;
  });

  const toggleAll = (): void => {
    setSelectedInstances(selectedInstances.length ? [] : instances);
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
              disabled={!instances.length}
              checked={
                selectedInstances.length === instances.length &&
                !!instances.length
              }
              indeterminate={
                !!selectedInstances.length &&
                selectedInstances.length < instances.length
              }
            />
            <span id="column-1-label">Name</span>
          </>
        ),
        Cell: ({ row }: CellProps<Instance>): ReactNode => (
          <div
            className={classNames(classes.rowHeader, {
              [classes.nested]: (row as Row<Instance> & { depth: number })
                .depth,
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
                  ? `/instances/${row.original.parent.id}/${row.original.id}`
                  : `/instances/${row.original.id}`
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
        Cell: ({ row: { original } }: CellProps<Instance>): ReactNode => {
          const { label } = getStatusCellIconAndLabel(original);
          return label;
        },
        getCellIcon: ({ row: { original } }): string | undefined => {
          const { icon } = getStatusCellIconAndLabel(original);
          return icon;
        },
      },
      {
        accessor: "upgrades",
        canBeHidden: true,
        optionLabel: "Upgrades",
        Header: "Upgrades",
        Cell: ({ row: { original } }: CellProps<Instance>): ReactNode => {
          const { label } = getUpgradesCellIconAndLabel(original);
          return label;
        },
        getCellIcon: ({
          row: { original },
        }: CellProps<Instance>): string | undefined => {
          const { icon } = getUpgradesCellIconAndLabel(original);
          return icon;
        },
      },
      {
        accessor: "os",
        canBeHidden: true,
        optionLabel: "OS",
        Header: "OS",
        Cell: ({ row: { original } }: CellProps<Instance>): ReactNode => (
          <>{original.distribution_info?.description ?? <NoData />}</>
        ),
      },
      {
        accessor: "availability_zone",
        canBeHidden: true,
        optionLabel: "Availability zone",
        Header: "Availability zone",
        Cell: ({ row: { original } }: CellProps<Instance>): ReactNode => (
          <>{original.cloud_init.availability_zone ?? <NoData />}</>
        ),
      },
      {
        accessor: "ubuntu_pro",
        canBeHidden: true,
        optionLabel: "Ubuntu pro",
        Header: "Ubuntu pro",
        Cell: ({ row }: CellProps<Instance>): ReactNode => (
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
        Cell: ({ row }: CellProps<Instance>): ReactNode => (
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
