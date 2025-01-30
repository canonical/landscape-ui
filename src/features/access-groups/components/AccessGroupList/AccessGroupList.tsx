import NoData from "@/components/layout/NoData";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import {
  ConfirmationButton,
  Icon,
  ICONS,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import type { CellProps, Column, Row } from "react-table";
import type { FC } from "react";
import { useMemo } from "react";
import AccessGroupInstanceCountCell from "../AccessGroupInstanceCountCell";
import classes from "./AccessGroupList.module.scss";
import { buildHierarchy, findAncestors, handleCellProps } from "./helpers";
import type { AccessGroup, AccessGroupWithInstancesCount } from "../../types";

interface AccessGroupListProps {
  readonly accessGroups: AccessGroup[];
}

const AccessGroupList: FC<AccessGroupListProps> = ({ accessGroups }) => {
  const { groupBy, search } = usePageParams();
  const { removeAccessGroupQuery } = useRoles();
  const debug = useDebug();

  const { mutateAsync: removeAccessGroup, isPending: isRemoving } =
    removeAccessGroupQuery;

  const accessGroupsData: AccessGroupWithInstancesCount[] = useMemo(() => {
    const filteredAccessGroups = search
      ? accessGroups.filter(
          (group) =>
            group.name.toLowerCase().includes(search.toLowerCase()) ||
            group.title.toLowerCase().includes(search.toLowerCase()),
        )
      : accessGroups;

    if (groupBy !== "parent") {
      return filteredAccessGroups.map((group) => ({
        ...group,
        instancesCount: 0,
      }));
    }

    const allRelevantGroups = Array.from(
      new Set([
        ...filteredAccessGroups,
        ...filteredAccessGroups.flatMap((group) =>
          findAncestors(group.parent || "", accessGroups),
        ),
      ]),
    );

    const childAccessGroupNames = new Set(
      allRelevantGroups
        .filter((group) => group.parent)
        .map((group) => group.name),
    );

    return allRelevantGroups
      .filter((accessGroup) => !childAccessGroupNames.has(accessGroup.name))
      .map((accessGroup) => ({
        ...accessGroup,
        instancesCount: 0,
        subRows: buildHierarchy(accessGroup.name, allRelevantGroups),
      }));
  }, [accessGroups, search, groupBy]);

  const handleRemoveAccessGroup = async (accessGroupName: string) => {
    try {
      await removeAccessGroup({
        name: accessGroupName,
      });
    } catch (error) {
      debug(error);
    }
  };

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
        accessor: "id",
        className: classes.actions,
        Cell: ({ row }: CellProps<AccessGroupWithInstancesCount>) => {
          if (row.original.name === "global") {
            return null;
          }

          return (
            <div className="divided-blocks">
              <div className="divided-blocks__item">
                <ConfirmationButton
                  className="u-no-margin--bottom u-no-padding--left is-small has-icon"
                  type="button"
                  appearance="base"
                  aria-label={`Remove ${row.original.name} access group`}
                  confirmationModalProps={{
                    title: `Deleting ${row.original.name} access group`,
                    children: <p>Are you sure?</p>,
                    confirmButtonLabel: "Delete",
                    confirmButtonAppearance: "negative",
                    confirmButtonDisabled: isRemoving,
                    confirmButtonLoading: isRemoving,
                    onConfirm: () => handleRemoveAccessGroup(row.original.name),
                  }}
                >
                  <Tooltip position="btm-center" message="Delete">
                    <Icon name={ICONS.delete} />
                  </Tooltip>
                </ConfirmationButton>
              </div>
            </div>
          );
        },
      },
    ],
    [groupBy, accessGroups],
  );

  return (
    <ModularTable
      columns={columns}
      data={accessGroupsData}
      sortable
      getCellProps={handleCellProps}
      emptyMsg="No access groups found according to your search parameters."
    />
  );
};

export default AccessGroupList;
