import type { ColumnFilterOption } from "@/components/form/ColumnFilter";
import ListTitle from "@/components/layout/ListTitle";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import StaticLink from "@/components/layout/StaticLink";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import usePageParams from "@/hooks/usePageParams";
import { ROUTES } from "@/libs/routes";
import type { Instance } from "@/types/Instance";
import { Button, CheckboxInput } from "@canonical/react-components";
import moment from "moment";
import { memo, useCallback, useEffect, useId, useMemo } from "react";
import type { CellProps, Column } from "react-table";
import {
  createHeaderPropsGetter,
  getCellProps,
  getColumnFilterOptions,
  getRowProps,
  getStatusCellIconAndLabel,
  getUpgradesCellIconAndLabel,
} from "./helpers";
import classes from "./InstanceList.module.scss";
import type { InstanceColumn } from "./types";

interface InstanceListProps {
  readonly instances: Instance[];
  readonly instanceCount: number | undefined;
  readonly selectedInstances: Instance[];
  readonly setColumnFilterOptions: (options: ColumnFilterOption[]) => void;
  readonly setSelectedInstances: (instances: Instance[]) => void;
}

const InstanceList = memo(function InstanceList({
  instances: currentInstances,
  instanceCount,
  selectedInstances,
  setColumnFilterOptions,
  setSelectedInstances,
}: InstanceListProps) {
  const { disabledColumns, ...filters } = usePageParams();

  const { expandedRowIndex, getTableRowsRef, handleExpand } =
    useExpandableRow();

  const titleId = useId();

  const isFilteringInstances = Object.values(filters).some((filter) => {
    if (typeof filter === "string") {
      return filter.length > 0;
    } else if (Array.isArray(filter)) {
      return filter.length > 0;
    }

    return false;
  });

  const isSelected = useCallback(
    (instance: Instance) =>
      selectedInstances.some(
        (selectedInstance) => selectedInstance.id === instance.id,
      ),
    [selectedInstances],
  );

  const isNotSelected = useCallback(
    (instance: Instance) => !isSelected(instance),
    [isSelected],
  );

  const deselect = useCallback(
    (...instances: Instance[]) => {
      setSelectedInstances(
        selectedInstances.filter(
          (selectedInstance) =>
            !instances.some((instance) => selectedInstance.id === instance.id),
        ),
      );
    },
    [setSelectedInstances, selectedInstances],
  );

  const select = useCallback(
    (...instances: Instance[]) => {
      setSelectedInstances([...selectedInstances, ...instances]);
    },
    [setSelectedInstances, selectedInstances],
  );

  const selectAll = useCallback(() => {
    select(...currentInstances.filter(isNotSelected));
  }, [currentInstances, select, isNotSelected]);

  const toggleAll = useCallback(() => {
    if (currentInstances.some(isSelected)) {
      deselect(...currentInstances);
    } else {
      selectAll();
    }
  }, [deselect, selectAll, currentInstances, isSelected]);

  const columns = useMemo<InstanceColumn[]>(
    () => [
      {
        accessor: "title",
        canBeHidden: false,
        optionLabel: "Instance name",
        Header: (
          <div className={classes.rowHeader}>
            <CheckboxInput
              label={<span className="u-off-screen">Toggle all instances</span>}
              inline
              onChange={toggleAll}
              disabled={currentInstances.length === 0}
              checked={
                currentInstances.every(isSelected) &&
                currentInstances.length !== 0
              }
              indeterminate={
                currentInstances.some(isSelected) &&
                currentInstances.some(isNotSelected)
              }
            />
            <ListTitle>
              <span id={titleId}>Title</span>
              <span className="u-text--muted">Hostname</span>
            </ListTitle>
          </div>
        ),
        Cell: ({ row }: CellProps<Instance>) => {
          return (
            <div className={classes.rowHeader}>
              <CheckboxInput
                label={
                  <span className="u-off-screen">{row.original.title}</span>
                }
                labelClassName="u-no-margin--bottom u-no-padding--top"
                checked={isSelected(row.original)}
                onChange={() => {
                  if (isSelected(row.original)) {
                    deselect(row.original);
                  } else {
                    select(row.original);
                  }
                }}
              />
              <ListTitle>
                <StaticLink
                  to={ROUTES.instances.details.fromInstance(row.original)}
                >
                  {row.original.title}
                </StaticLink>
                <span className="u-text--muted">
                  {row.original.hostname || <NoData />}
                </span>
              </ListTitle>
            </div>
          );
        },
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
        accessor: "tags",
        canBeHidden: true,
        optionLabel: "Tags",
        Header: "Tags",
        Cell: ({ row: { original, index } }: CellProps<Instance>) => {
          if (!original.tags.length) {
            return <NoData />;
          }

          const onExpand = () => {
            handleExpand(index);
          };

          return (
            <TruncatedCell
              content={original.tags.map((tag) => (
                <span className="truncatedItem" key={tag}>
                  {tag}
                </span>
              ))}
              isExpanded={index === expandedRowIndex}
              onExpand={onExpand}
              showCount
            />
          );
        },
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
        Header: "Ubuntu pro expiration",
        className: "date-cell",
        Cell: ({ row }: CellProps<Instance>) => {
          if (
            row.original.ubuntu_pro_info?.attached &&
            moment(row.original.ubuntu_pro_info.expires).isValid()
          ) {
            return (
              <span className="font-monospace">
                {moment(row.original.ubuntu_pro_info.expires).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )}
              </span>
            );
          }

          return <NoData />;
        },
      },
      {
        accessor: "last_ping",
        canBeHidden: true,
        optionLabel: "Last ping",
        Header: "Last ping time",
        className: "date-cell",
        Cell: ({ row }: CellProps<Instance>) => (
          <>
            {moment(row.original.last_ping_time).isValid() ? (
              <span className="font-monospace">
                {moment(row.original.last_ping_time).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )}
              </span>
            ) : (
              <NoData />
            )}
          </>
        ),
      },
    ],
    [
      currentInstances,
      expandedRowIndex,
      handleExpand,
      titleId,
      isSelected,
      isNotSelected,
      select,
      deselect,
      toggleAll,
    ],
  );

  useEffect(() => {
    setColumnFilterOptions(getColumnFilterOptions(columns));
  }, [columns, setColumnFilterOptions]);

  const filteredColumns = useMemo<Column<Instance>[]>(
    () =>
      columns.filter(
        ({ accessor }) =>
          typeof accessor === "string" && !disabledColumns.includes(accessor),
      ),
    [disabledColumns, columns],
  );

  const clearSelection = () => {
    setSelectedInstances([]);
  };

  const subhead = !!selectedInstances.length &&
    instanceCount !== undefined &&
    instanceCount > currentInstances.length && (
      <td colSpan={8} className="u-no-padding">
        <div className={classes.subhead}>
          <span>
            {selectedInstances.length} of {instanceCount} instances selected
          </span>
          <div className={classes.buttons}>
            <Button
              className="u-no-padding u-no-margin"
              appearance="link"
              onClick={clearSelection}
            >
              Clear selection
            </Button>
            {currentInstances.some(isNotSelected) && (
              <Button
                className="u-no-padding u-no-margin"
                appearance="link"
                onClick={selectAll}
              >
                Select all instances on this page
              </Button>
            )}
          </div>
        </div>
      </td>
    );

  return (
    <ResponsiveTable
      subhead={subhead}
      emptyMsg={
        isFilteringInstances
          ? "No instances found according to your search parameters."
          : "No instances found"
      }
      ref={getTableRowsRef}
      columns={filteredColumns}
      data={currentInstances}
      getHeaderProps={createHeaderPropsGetter(titleId)}
      getRowProps={getRowProps(expandedRowIndex)}
      getCellProps={getCellProps(expandedRowIndex)}
      minWidth={1400}
    />
  );
});

export default InstanceList;
