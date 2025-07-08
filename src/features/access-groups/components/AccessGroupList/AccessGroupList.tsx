import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { DEFAULT_ACCESS_GROUP_NAME } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column, Row } from "react-table";
import type { AccessGroup, AccessGroupWithInstancesCount } from "../../types";
import AccessGroupInstanceCountCell from "../AccessGroupInstanceCountCell";
import AccessGroupListActions from "../AccessGroupListActions";
import { handleCellProps } from "./helpers";

interface AccessGroupListProps {
  readonly accessGroups: AccessGroup[];
}

const AccessGroupList: FC<AccessGroupListProps> = ({ accessGroups }) => {
  const { search } = usePageParams();

  const accessGroupsData: AccessGroupWithInstancesCount[] = useMemo(() => {
    const filteredAccessGroups = search
      ? accessGroups.filter(
          (group) =>
            group.name.toLowerCase().includes(search.toLowerCase()) ||
            group.title.toLowerCase().includes(search.toLowerCase()),
        )
      : accessGroups;

    return filteredAccessGroups.map((group) => ({
      ...group,
      instancesCount: 0,
    }));
  }, [accessGroups, search]);

  const columns = useMemo<Column<AccessGroupWithInstancesCount>[]>(
    () => [
      {
        accessor: "title",
        Header: "title",
        Cell: ({ row }: CellProps<AccessGroupWithInstancesCount>) => {
          return (
            <div
              style={{
                paddingLeft: `${(row as Row<AccessGroupWithInstancesCount> & { depth: number }).depth * 1.25}rem`,
              }}
            >
              <span>{row.original.title}</span>
            </div>
          );
        },
      },
      {
        accessor: "name",
        Header: "name",
      },
      {
        accessor: "instancesCount",
        Header: "affected instances",
        sortType: (
          rowA: Row<AccessGroupWithInstancesCount>,
          rowB: Row<AccessGroupWithInstancesCount>,
        ) => {
          return rowA.original.instancesCount - rowB.original.instancesCount;
        },
        Cell: ({ row }: CellProps<AccessGroupWithInstancesCount>) => (
          <AccessGroupInstanceCountCell accessGroup={row.original} />
        ),
      },
      {
        accessor: "parent",
        Header: "parent",
        Cell: ({
          row: { original },
        }: CellProps<AccessGroupWithInstancesCount>) => {
          const parentTitle = accessGroups.find(
            (group) => group.name === original.parent,
          )?.title;

          return parentTitle || <NoData />;
        },
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row }: CellProps<AccessGroupWithInstancesCount>) => {
          if (row.original.name === DEFAULT_ACCESS_GROUP_NAME) {
            return null;
          }

          const parentTitle =
            accessGroups.find((group) => group.name === row.original.parent)
              ?.title || row.original.parent;

          return (
            <AccessGroupListActions
              accessGroup={row.original}
              parentAccessGroupTitle={parentTitle}
            />
          );
        },
      },
    ],
    [accessGroups],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={accessGroupsData}
      sortable
      getCellProps={handleCellProps}
      emptyMsg="No access groups found according to your search parameters."
    />
  );
};

export default AccessGroupList;
