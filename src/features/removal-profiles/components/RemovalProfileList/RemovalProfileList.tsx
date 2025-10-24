import ProfileAssociatedInstancesLink from "@/components/form/ProfileAssociatedInstancesLink";
import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import ListTitle, {
  LIST_TITLE_COLUMN_PROPS,
} from "@/components/layout/ListTitle";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { getTitleByName } from "@/utils/_helpers";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { RemovalProfile } from "../../types";
import RemovalProfileListActions from "../RemovalProfileListActions";
import { getCellProps, getRowProps } from "./helpers";

interface RemovalProfileListProps {
  readonly profiles: RemovalProfile[];
}

const RemovalProfileList: FC<RemovalProfileListProps> = ({ profiles }) => {
  const { search, createPageParamsSetter } = usePageParams();
  const { getAccessGroupQuery } = useRoles();
  const { expandedRowIndex, handleExpand, getTableRowsRef } =
    useExpandableRow();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const filteredProfiles = useMemo(() => {
    if (!search) {
      return profiles;
    }

    return profiles.filter((profile) => {
      return profile.title.toLowerCase().includes(search.toLowerCase());
    });
  }, [profiles, search]);

  const columns = useMemo<Column<RemovalProfile>[]>(
    () => [
      {
        ...LIST_TITLE_COLUMN_PROPS,
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} profile title and name`,
        },
        Cell: ({ row: { original } }: CellProps<RemovalProfile>) => (
          <ListTitle>
            <Button
              type="button"
              appearance="link"
              onClick={createPageParamsSetter({
                sidePath: ["view"],
                profile: original.id.toString(),
              })}
              className="u-no-margin--bottom u-no-padding--top u-align--left"
              aria-label={`Open "${original.title}" profile details`}
            >
              {original.title}
            </Button>

            <span className="u-text--muted">{original.name}</span>
          </ListTitle>
        ),
      },
      {
        accessor: "access_group",
        Header: "Access group",
        meta: {
          ariaLabel: (row) => `${row.original.title} profile access group`,
        },
        Cell: ({ row: { original } }: CellProps<RemovalProfile>) => (
          <>
            {getTitleByName(original.access_group, getAccessGroupQueryResult)}
          </>
        ),
      },
      {
        accessor: "tags",
        Header: "Tags",
        meta: {
          ariaLabel: (row) => `${row.original.title} profile tags`,
        },
        Cell: ({ row: { original, index } }: CellProps<RemovalProfile>) =>
          original.tags.length > 0 ? (
            <TruncatedCell
              content={original.tags.map((tag) => (
                <span className="truncatedItem" key={tag}>
                  {tag}
                </span>
              ))}
              isExpanded={index == expandedRowIndex}
              onExpand={() => {
                handleExpand(index);
              }}
              showCount
            />
          ) : (
            <NoData />
          ),
      },
      {
        accessor: "associated",
        Header: "Associated",
        meta: {
          ariaLabel: (row) =>
            `${row.original.title} profile associated instances`,
        },
        Cell: ({
          row: { original: removalProfile },
        }: CellProps<RemovalProfile>) => {
          return (
            <ProfileAssociatedInstancesLink
              count={removalProfile.computers.num_associated_computers}
              profile={removalProfile}
              query={`removal:${removalProfile.id}`}
            />
          );
        },
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original } }: CellProps<RemovalProfile>) => (
          <RemovalProfileListActions profile={original} />
        ),
      },
    ],
    [
      createPageParamsSetter,
      expandedRowIndex,
      getAccessGroupQueryResult,
      handleExpand,
    ],
  );

  return (
    <ResponsiveTable
      ref={getTableRowsRef}
      columns={columns}
      data={filteredProfiles}
      emptyMsg={`No removal profiles found with the search: "${search}"`}
      getCellProps={getCellProps(expandedRowIndex)}
      getRowProps={getRowProps(expandedRowIndex)}
    />
  );
};

export default RemovalProfileList;
