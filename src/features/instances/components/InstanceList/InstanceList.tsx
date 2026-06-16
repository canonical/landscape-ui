import type { ColumnFilterOption } from "@/components/form/ColumnFilter";
import ListTitle from "@/components/layout/ListTitle";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import StaticLink from "@/components/layout/StaticLink";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import usePageParams from "@/hooks/usePageParams";
import { ROUTES } from "@/libs/routes";
import type { Instance } from "@/types/Instance";
import {
  Button,
  CheckboxInput,
  Icon,
  Tooltip,
} from "@canonical/react-components";
import classNames from "classnames";
import moment from "moment";
import { memo, useCallback, useEffect, useId, useMemo } from "react";
import type { CellProps, Column } from "react-table";
import InstanceStatus, {
  InstanceUpgrades,
  type StatusItem,
  Tags,
} from "../InstanceStatus";
import {
  createHeaderPropsGetter,
  getCellProps,
  getColumnFilterOptions,
  getRowProps,
} from "./helpers";
import classes from "./InstanceList.module.scss";
import type { InstanceColumn } from "./types";

interface InstanceListProps {
  readonly instances: Instance[];
  readonly instanceCount: number | undefined;
  readonly selectedInstances: Instance[];
  readonly setColumnFilterOptions: (options: ColumnFilterOption[]) => void;
  readonly setSelectedInstances: (instances: Instance[]) => void;
  readonly isAllSelected: boolean;
  readonly onSelectAll: () => void;
  readonly onClearSelection: () => void;
}

const InstanceList = memo(function InstanceList({
  instances: currentInstances,
  instanceCount,
  selectedInstances,
  setColumnFilterOptions,
  setSelectedInstances,
  isAllSelected,
  onSelectAll,
  onClearSelection,
}: InstanceListProps) {
  const { disabledColumns, ...filters } = usePageParams();
  const {
    setPageParams,
    tags: activeTags,
    status: activeStatus,
    upgrades: activeUpgrades,
  } = filters;

  const {
    expandedRowIndex,
    expandedColumnId,
    getTableRowsRef,
    handleExpand,
    collapse,
  } = useExpandableRow();

  const titleId = useId();

  // Filtering re-renders the table with a different dataset, so any expanded
  // cell is collapsed first — otherwise its coordinates would leave an
  // unrelated row at the same index rendered in the expanded state.
  const toggleTagFilter = useCallback(
    (tag: string) => {
      collapse();
      setPageParams({
        tags: activeTags.includes(tag)
          ? activeTags.filter((current) => current !== tag)
          : [...activeTags, tag],
      });
    },
    [activeTags, collapse, setPageParams],
  );

  // The status filter is single-select, so clicking a pill swaps to that status
  // (or clears it when it's already the active one).
  const toggleStatusFilter = useCallback(
    (status: StatusItem) => {
      if (!status.filterValue) {
        return;
      }

      collapse();
      setPageParams({
        status: activeStatus === status.filterValue ? "" : status.filterValue,
      });
    },
    [activeStatus, collapse, setPageParams],
  );

  // Upgrades are a multi-select filter, so clicking a pill toggles that upgrade
  // type in (or out of) the active set.
  const toggleUpgradeFilter = useCallback(
    (upgrade: StatusItem) => {
      if (!upgrade.filterValue) {
        return;
      }

      const { filterValue } = upgrade;

      collapse();
      setPageParams({
        upgrades: activeUpgrades.includes(filterValue)
          ? activeUpgrades.filter((current) => current !== filterValue)
          : [...activeUpgrades, filterValue],
      });
    },
    [activeUpgrades, collapse, setPageParams],
  );

  const isSelected = useCallback(
    (instance: Instance) =>
      isAllSelected ||
      selectedInstances.some(
        (selectedInstance) => selectedInstance.id === instance.id,
      ),
    [isAllSelected, selectedInstances],
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

  const toggleAll = useCallback(() => {
    if (isAllSelected || currentInstances.some(isSelected)) {
      onClearSelection();
    } else {
      select(...currentInstances.filter(isNotSelected));
    }
  }, [
    isAllSelected,
    onClearSelection,
    select,
    currentInstances,
    isSelected,
    isNotSelected,
  ]);

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
                  if (isAllSelected) {
                    onClearSelection();
                  } else if (isSelected(row.original)) {
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
        accessor: "upgrades",
        canBeHidden: true,
        optionLabel: "Upgrades",
        Header: "Upgrades",
        Cell: ({ row: { original } }: CellProps<Instance>) => (
          <InstanceUpgrades
            instance={original}
            onUpgradeClick={toggleUpgradeFilter}
          />
        ),
      },
      {
        accessor: "status",
        canBeHidden: true,
        optionLabel: "Status",
        Header: "Status",
        Cell: ({ row: { original, index } }: CellProps<Instance>) => (
          <InstanceStatus
            instance={original}
            expandable
            isExpanded={
              index === expandedRowIndex && expandedColumnId === "status"
            }
            onExpand={() => {
              handleExpand(index, "status");
            }}
            onStatusClick={toggleStatusFilter}
          />
        ),
      },
      {
        accessor: "os",
        canBeHidden: true,
        optionLabel: "OS",
        Header: "OS",
        getCellIcon: () => {
          return "";
        },
        Cell: ({ row: { original } }: CellProps<Instance>) => {
          if (!original.has_release_upgrades) {
            return <>{original.distribution_info?.description || <NoData />}</>;
          }

          return (
            <span className={classes.indicatorWrapper}>
              <span className={classes.indicatorIcon}>
                <Tooltip message="Distribution upgrade available">
                  <Icon
                    className={classNames(
                      "u-no-margin--left",
                      classes.distributionUpgradeIcon,
                    )}
                    name="arrow-up--caution"
                  />
                </Tooltip>
              </span>
              <span>
                {original.distribution_info?.description || <NoData />}
              </span>
            </span>
          );
        },
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

          return (
            <Tags
              tags={original.tags}
              expandable
              isExpanded={
                index === expandedRowIndex && expandedColumnId === "tags"
              }
              onExpand={() => {
                handleExpand(index, "tags");
              }}
              onTagClick={toggleTagFilter}
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
        className: "large-cell",
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
        className: "large-cell",
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
      expandedColumnId,
      handleExpand,
      toggleTagFilter,
      toggleStatusFilter,
      toggleUpgradeFilter,
      titleId,
      isSelected,
      isNotSelected,
      isAllSelected,
      select,
      deselect,
      toggleAll,
      onClearSelection,
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

  const showSubhead =
    (isAllSelected || !!selectedInstances.length) &&
    instanceCount !== undefined &&
    instanceCount > currentInstances.length;

  const subhead = showSubhead && (
    <tr>
      <td colSpan={filteredColumns.length} className="u-no-padding">
        <div className={classes.subhead}>
          <span>
            {isAllSelected
              ? `All ${instanceCount} instances selected`
              : `${selectedInstances.length} of ${instanceCount} instances selected`}
          </span>
          <div className={classes.buttons}>
            {!isAllSelected && (
              <Button
                className="u-no-padding u-no-margin"
                appearance="link"
                onClick={onSelectAll}
              >
                Select all {instanceCount} instances
              </Button>
            )}
            <Button
              className="u-no-padding u-no-margin"
              appearance="link"
              onClick={onClearSelection}
            >
              Clear selection
            </Button>
          </div>
        </div>
      </td>
    </tr>
  );

  return (
    <ResponsiveTable
      subhead={subhead}
      emptyMsg="No instances found according to your search parameters."
      ref={getTableRowsRef}
      columns={filteredColumns}
      data={currentInstances}
      getHeaderProps={createHeaderPropsGetter(titleId)}
      getRowProps={getRowProps(expandedRowIndex)}
      getCellProps={getCellProps(expandedRowIndex, expandedColumnId)}
      minWidth={1400}
    />
  );
});

export default InstanceList;
