import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import StaticLink from "@/components/layout/StaticLink";
import { getStatusCellIconAndLabel } from "@/features/instances";
import usePageParams from "@/hooks/usePageParams";
import useSelection from "@/hooks/useSelection";
import type {
  WindowsInstance,
  WslInstanceWithoutRelation,
} from "@/types/Instance";
import { CheckboxInput } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import WslInstanceListActions from "../WslInstanceListActions";
import WslInstancesHeader from "../WslInstancesHeader";
import classes from "./WslInstanceList.module.scss";

interface WslInstanceListProps {
  readonly instance: WindowsInstance;
}

const WslInstanceList: FC<WslInstanceListProps> = ({
  instance: windowsInstance,
}) => {
  const { search } = usePageParams();

  const wslInstances = useMemo(() => {
    if (!search) {
      return windowsInstance.children;
    }

    return windowsInstance.children.filter(
      ({ title, hostname }) =>
        title.toLowerCase().includes(search.toLowerCase()) ||
        hostname?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [windowsInstance, search]);

  const {
    selectedItems: selectedWslInstances,
    setSelectedItems: setSelectedWslInstances,
  } = useSelection(wslInstances);

  const handleInstanceCheck = (instance: WslInstanceWithoutRelation) => {
    setSelectedWslInstances((prevState) =>
      prevState.some(({ id }) => id === instance.id)
        ? prevState.filter(({ id }) => id !== instance.id)
        : [...prevState, instance],
    );
  };

  const columns = useMemo<Column<WslInstanceWithoutRelation>[]>(
    () => [
      {
        accessor: "title",
        Header: (
          <>
            <CheckboxInput
              inline
              label={<span className="u-off-screen">Toggle all instances</span>}
              checked={
                wslInstances.length > 0 &&
                selectedWslInstances.length === wslInstances.length
              }
              indeterminate={
                selectedWslInstances.length > 0 &&
                selectedWslInstances.length < wslInstances.length
              }
              onChange={() => {
                setSelectedWslInstances(
                  selectedWslInstances.length > 0 ? [] : wslInstances,
                );
              }}
            />
            <span>Instance name</span>
          </>
        ),
        Cell: ({ row }: CellProps<WslInstanceWithoutRelation>) => (
          <div className={classes.title}>
            <CheckboxInput
              label={
                <span className="u-off-screen">{`Toggle ${row.original.title} instance`}</span>
              }
              labelClassName="u-no-margin--bottom u-no-padding--top"
              checked={selectedWslInstances.some(
                ({ id }) => id === row.original.id,
              )}
              onChange={() => {
                handleInstanceCheck(row.original);
              }}
            />
            <StaticLink
              to={`/instances/${windowsInstance.id}/${row.original.id}`}
            >
              {row.original.title}
            </StaticLink>
          </div>
        ),
      },
      {
        Header: "Status",
        getCellIcon: ({
          row: { original: wslInstance },
        }: CellProps<WslInstanceWithoutRelation>) => {
          return getStatusCellIconAndLabel(wslInstance).icon;
        },
        Cell: ({
          row: { original: wslInstance },
        }: CellProps<WslInstanceWithoutRelation>) => {
          return getStatusCellIconAndLabel(wslInstance).label;
        },
      },
      {
        accessor: "distribution",
        Header: "OS",
        Cell: ({ row: { original } }: CellProps<WslInstanceWithoutRelation>) =>
          original.distribution_info.description,
      },
      {
        Header: "WSL profile",
        Cell: <NoData />,
      },
      {
        accessor: "default",
        Header: "Default",
        Cell: ({ row: { original } }: CellProps<WslInstanceWithoutRelation>) =>
          original.is_default_child ? "Yes" : "No",
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({
          row: { original },
        }: CellProps<WslInstanceWithoutRelation>) => (
          <WslInstanceListActions
            windowsInstance={windowsInstance}
            wslInstance={original}
          />
        ),
      },
    ],
    [wslInstances, selectedWslInstances],
  );

  return (
    <>
      <WslInstancesHeader windowsInstance={windowsInstance} />

      <ResponsiveTable
        columns={columns}
        data={wslInstances}
        emptyMsg="No WSL instances found according to your search parameters."
      />
    </>
  );
};

export default WslInstanceList;
