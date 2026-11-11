import ListTitle from "@/components/layout/ListTitle";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import StaticLink from "@/components/layout/StaticLink";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import {
  InstanceStatus,
  InstanceTags,
  InstanceUpgrades,
} from "@/features/instances";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import usePageParams from "@/hooks/usePageParams";
import date from "@/libs/date";
import { ROUTES } from "@/libs/routes";
import type { Instance } from "@/types/Instance";
import { Icon, Tooltip } from "@canonical/react-components";
import classNames from "classnames";
import type { ComponentProps, FC } from "react";
import { useCallback, useId, useMemo } from "react";
import type { CellProps, Column } from "react-table";
import { createHeaderPropsGetter, getCellProps, getRowProps } from "./helpers";
import classes from "./SupportInstancesList.module.scss";

type StatusItem = Parameters<
  NonNullable<ComponentProps<typeof InstanceStatus>["onStatusClick"]>
>[0];

const DateCell: FC<{ readonly value: string | null | undefined }> = ({
  value,
}) =>
  value && date(value).isValid() ? (
    <span className="font-monospace">
      {date(value).format(DISPLAY_DATE_TIME_FORMAT)}
    </span>
  ) : (
    <NoData />
  );

interface SupportInstancesListProps {
  /** The account the instances belong to. */
  readonly name: string;
  readonly instances: Instance[];
}

/** The account's instances, read-only: pills and tags filter the list. */
const SupportInstancesList: FC<SupportInstancesListProps> = ({
  name,
  instances,
}) => {
  const {
    disabledColumns,
    setPageParams,
    tags: activeTags,
    status: activeStatus,
    upgrades: activeUpgrades,
  } = usePageParams();

  const {
    expandedRowIndex,
    expandedColumnId,
    getTableRowsRef,
    handleExpand,
    collapse,
  } = useExpandableRow();

  const titleId = useId();

  // Filtering swaps the rows, so an expanded cell is collapsed first: its
  // coordinates would otherwise expand an unrelated row at the same index.
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

  const toggleStatusFilter = useCallback(
    ({ filterValue }: StatusItem) => {
      if (!filterValue) {
        return;
      }

      collapse();
      setPageParams({
        status: activeStatus === filterValue ? "" : filterValue,
      });
    },
    [activeStatus, collapse, setPageParams],
  );

  const toggleUpgradeFilter = useCallback(
    ({ filterValue }: StatusItem) => {
      if (!filterValue) {
        return;
      }

      collapse();
      setPageParams({
        upgrades: activeUpgrades.includes(filterValue)
          ? activeUpgrades.filter((current) => current !== filterValue)
          : [...activeUpgrades, filterValue],
      });
    },
    [activeUpgrades, collapse, setPageParams],
  );

  const columns = useMemo<Column<Instance>[]>(
    () => [
      {
        accessor: "title",
        Header: (
          <ListTitle>
            <span id={titleId}>Title</span>
            <span className="u-text--muted">Hostname</span>
          </ListTitle>
        ),
        Cell: ({ row: { original } }: CellProps<Instance>) => (
          <ListTitle>
            <StaticLink
              to={
                original.parent
                  ? ROUTES.superAdmin.sessionInstanceChild(
                      name,
                      original.parent.id,
                      original.id,
                    )
                  : ROUTES.superAdmin.sessionInstance(name, original.id)
              }
            >
              {original.title}
            </StaticLink>
            <span className="u-text--muted">
              {original.hostname || <NoData />}
            </span>
          </ListTitle>
        ),
      },
      {
        accessor: "upgrades",
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
        Header: "OS",
        Cell: ({ row: { original } }: CellProps<Instance>) => {
          const description = original.distribution_info?.description || (
            <NoData />
          );

          if (!original.has_release_upgrades) {
            return description;
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
              <span>{description}</span>
            </span>
          );
        },
      },
      {
        accessor: "tags",
        Header: "Tags",
        Cell: ({ row: { original, index } }: CellProps<Instance>) =>
          original.tags.length ? (
            <InstanceTags
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
          ) : (
            <NoData />
          ),
      },
      {
        accessor: "availability_zone",
        Header: "Availability zone",
        Cell: ({ row: { original } }: CellProps<Instance>) =>
          original.cloud_init?.availability_zone ?? <NoData />,
      },
      {
        accessor: "ubuntu_pro",
        Header: "Ubuntu pro expiration",
        className: "large-cell",
        Cell: ({ row: { original } }: CellProps<Instance>) => (
          <DateCell
            value={
              original.ubuntu_pro_info?.attached
                ? original.ubuntu_pro_info.expires
                : null
            }
          />
        ),
      },
      {
        accessor: "last_ping_time",
        Header: "Last ping time",
        className: "large-cell",
        Cell: ({ row: { original } }: CellProps<Instance>) => (
          <DateCell value={original.last_ping_time} />
        ),
      },
    ],
    [
      expandedRowIndex,
      expandedColumnId,
      handleExpand,
      toggleTagFilter,
      toggleStatusFilter,
      toggleUpgradeFilter,
      titleId,
      name,
    ],
  );

  const visibleColumns = useMemo(
    () =>
      columns.filter(
        ({ accessor }) =>
          typeof accessor === "string" && !disabledColumns.includes(accessor),
      ),
    [columns, disabledColumns],
  );

  return (
    <ResponsiveTable
      emptyMsg="No instances found according to your search parameters."
      ref={getTableRowsRef}
      columns={visibleColumns}
      data={instances}
      getHeaderProps={createHeaderPropsGetter(titleId)}
      getRowProps={getRowProps(expandedRowIndex)}
      getCellProps={getCellProps(expandedRowIndex, expandedColumnId)}
      minWidth={1400}
    />
  );
};

export default SupportInstancesList;
