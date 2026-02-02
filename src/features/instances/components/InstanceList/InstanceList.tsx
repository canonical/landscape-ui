import type { ColumnFilterOption } from "@/components/form/ColumnFilter";
import ListTitle from "@/components/layout/ListTitle";
import LoadingState from "@/components/layout/LoadingState";
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
import { useCallback, useEffect, useId, useMemo } from "react";
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
  readonly instanceCount: number;
  readonly toggledInstances: Instance[];
  readonly setColumnFilterOptions: (options: ColumnFilterOption[]) => void;
  readonly setToggledInstances: (instances: Instance[]) => void;
  readonly areAllInstancesSelected?: boolean;
  readonly selectAllInstances: () => void;
  readonly deselectAllInstances: () => void;
  readonly isGettingInstances?: boolean;
}

const InstanceList = ({
  instances: currentInstances,
  instanceCount,
  toggledInstances,
  setColumnFilterOptions,
  setToggledInstances,
  areAllInstancesSelected,
  selectAllInstances,
  deselectAllInstances,
  isGettingInstances,
}: InstanceListProps) => {
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

  const clearSelection = useCallback(() => {
    deselectAllInstances();
    setToggledInstances([]);
  }, [deselectAllInstances, setToggledInstances]);

  const isToggled = useCallback(
    (instance: Instance) =>
      toggledInstances.some(
        (toggledInstance) => toggledInstance.id === instance.id,
      ),
    [toggledInstances],
  );

  const isNotToggled = useCallback(
    (instance: Instance) => !isToggled(instance),
    [isToggled],
  );

  const untoggle = useCallback(
    (...instances: Instance[]) => {
      setToggledInstances(
        toggledInstances.filter(
          (toggledInstance) =>
            !instances.some((instance) => toggledInstance.id === instance.id),
        ),
      );
    },
    [setToggledInstances, toggledInstances],
  );

  const untoggleAll = useCallback(() => {
    untoggle(...currentInstances);
  }, [currentInstances, untoggle]);

  const toggle = useCallback(
    (...instances: Instance[]) => {
      const untoggledInstances = instances.filter(isNotToggled);

      if (
        areAllInstancesSelected &&
        toggledInstances.length + untoggledInstances.length >= instanceCount
      ) {
        clearSelection();
      } else {
        setToggledInstances([...toggledInstances, ...untoggledInstances]);
      }
    },
    [
      setToggledInstances,
      toggledInstances,
      isNotToggled,
      clearSelection,
      areAllInstancesSelected,
      instanceCount,
    ],
  );

  const toggleAll = useCallback(() => {
    toggle(...currentInstances);
  }, [currentInstances, toggle]);

  const columns = useMemo<InstanceColumn[]>(() => {
    return [
      {
        accessor: "title",
        canBeHidden: false,
        optionLabel: "Instance name",
        Header: () => (
          <div className={classes.rowHeader}>
            <CheckboxInput
              label={<span className="u-off-screen">Toggle all instances</span>}
              inline
              onChange={() => {
                if (
                  (areAllInstancesSelected &&
                    currentInstances.every(isToggled)) ||
                  (!areAllInstancesSelected && currentInstances.some(isToggled))
                ) {
                  untoggleAll();
                } else {
                  toggleAll();
                }
              }}
              disabled={currentInstances.length === 0}
              checked={
                areAllInstancesSelected
                  ? currentInstances.every(isNotToggled)
                  : currentInstances.every(isToggled)
              }
              indeterminate={
                currentInstances.some(isToggled) &&
                currentInstances.some(isNotToggled)
              }
            />
            <ListTitle>
              <span id={titleId}>Title</span>
              <span className="u-text--muted">Hostname</span>
            </ListTitle>
          </div>
        ),
        Cell: ({ row: { original: instance } }: CellProps<Instance>) => (
          <div className={classes.rowHeader}>
            <CheckboxInput
              label={<span className="u-off-screen">{instance.title}</span>}
              labelClassName="u-no-margin--bottom u-no-padding--top"
              checked={areAllInstancesSelected !== isToggled(instance)}
              onChange={() => {
                if (isToggled(instance)) {
                  untoggle(instance);
                } else {
                  toggle(instance);
                }
              }}
            />
            <ListTitle>
              <StaticLink to={ROUTES.instances.details.fromInstance(instance)}>
                {instance.title}
              </StaticLink>
              <span className="u-text--muted">
                {instance.hostname || <NoData />}
              </span>
            </ListTitle>
          </div>
        ),
      },
      {
        accessor: "status",
        canBeHidden: true,
        optionLabel: "Status",
        Header: "Status",
        Cell: ({ row: { original: instance } }: CellProps<Instance>) => {
          const { label } = getStatusCellIconAndLabel(instance);
          return label;
        },
        getCellIcon: ({ row: { original: instance } }) => {
          const { icon } = getStatusCellIconAndLabel(instance);
          return icon;
        },
      },
      {
        accessor: "upgrades",
        canBeHidden: true,
        optionLabel: "Upgrades",
        Header: "Upgrades",
        Cell: ({ row: { original: instance } }: CellProps<Instance>) => {
          const { label } = getUpgradesCellIconAndLabel(instance);
          return label;
        },
        getCellIcon: ({ row: { original: instance } }: CellProps<Instance>) => {
          const { icon } = getUpgradesCellIconAndLabel(instance);
          return icon;
        },
      },
      {
        accessor: "os",
        canBeHidden: true,
        optionLabel: "OS",
        Header: "OS",
        Cell: ({ row: { original: instance } }: CellProps<Instance>) => (
          <>{instance.distribution_info?.description ?? <NoData />}</>
        ),
      },
      {
        accessor: "tags",
        canBeHidden: true,
        optionLabel: "Tags",
        Header: "Tags",
        Cell: ({ row: { original: instance, index } }: CellProps<Instance>) => {
          if (!instance.tags.length) {
            return <NoData />;
          }

          const onExpand = () => {
            handleExpand(index);
          };

          return (
            <TruncatedCell
              content={instance.tags.map((tag) => (
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
        Cell: ({ row: { original: instance } }: CellProps<Instance>) => (
          <>{instance.cloud_init?.availability_zone ?? <NoData />}</>
        ),
      },
      {
        accessor: "ubuntu_pro",
        canBeHidden: true,
        optionLabel: "Ubuntu pro",
        Header: "Ubuntu pro expiration",
        className: "date-cell",
        Cell: ({ row: { original: instance } }: CellProps<Instance>) => {
          if (
            instance.ubuntu_pro_info?.attached &&
            moment(instance.ubuntu_pro_info.expires).isValid()
          ) {
            return (
              <span className="font-monospace">
                {moment(instance.ubuntu_pro_info.expires).format(
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
        Cell: ({ row: { original: instance } }: CellProps<Instance>) => (
          <>
            {moment(instance.last_ping_time).isValid() ? (
              <span className="font-monospace">
                {moment(instance.last_ping_time).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )}
              </span>
            ) : (
              <NoData />
            )}
          </>
        ),
      },
    ];
  }, [
    currentInstances,
    expandedRowIndex,
    handleExpand,
    titleId,
    areAllInstancesSelected,
    isToggled,
    isNotToggled,
    untoggleAll,
    toggleAll,
    toggle,
    untoggle,
  ]);

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

  if (isGettingInstances) {
    return <LoadingState />;
  }

  const emptyMsg = isFilteringInstances
    ? "No instances found according to your search parameters."
    : "No instances found";

  const clearToggledInstances = () => {
    setToggledInstances([]);
  };

  const subhead = (areAllInstancesSelected || !!toggledInstances.length) &&
    instanceCount > currentInstances.length && (
      <td colSpan={8} className="u-no-padding">
        <div className={classes.subhead}>
          <span>
            {areAllInstancesSelected
              ? instanceCount - toggledInstances.length
              : toggledInstances.length}{" "}
            of {instanceCount} instances selected
          </span>
          <Button
            className="u-no-padding u-no-margin"
            appearance="link"
            onClick={clearSelection}
          >
            Clear selection
          </Button>
          {((areAllInstancesSelected && currentInstances.some(isToggled)) ||
            (!areAllInstancesSelected &&
              currentInstances.some(isNotToggled))) && (
            <Button
              className="u-no-padding u-no-margin"
              appearance="link"
              onClick={() => {
                if (areAllInstancesSelected) {
                  untoggleAll();
                } else {
                  toggleAll();
                }
              }}
            >
              Select all instances on this page
            </Button>
          )}
          {((!areAllInstancesSelected &&
            toggledInstances.length < instanceCount) ||
            (areAllInstancesSelected && toggledInstances.length > 0)) && (
            <Button
              className="u-no-padding u-no-margin"
              appearance="link"
              onClick={() => {
                clearToggledInstances();
                selectAllInstances();
              }}
            >
              Select all instances on all pages
            </Button>
          )}
        </div>
      </td>
    );

  return (
    <ResponsiveTable
      subhead={subhead}
      emptyMsg={emptyMsg}
      ref={getTableRowsRef}
      columns={filteredColumns}
      data={currentInstances}
      getHeaderProps={createHeaderPropsGetter(titleId)}
      getRowProps={getRowProps(expandedRowIndex)}
      getCellProps={getCellProps(expandedRowIndex)}
      minWidth={1400}
    />
  );
};

export default InstanceList;
