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
  const { search, setPageParams } = usePageParams();
  const { getAccessGroupQuery } = useRoles();
  const { expandedRowIndex, handleExpand, getTableRowsRef } =
    useExpandableRow();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const filteredProfiles = useMemo(() => {
    if (!search) {
      return profiles;
    }

    return profiles.filter((profile) => {
      return profile.title.toLowerCase().includes(search.toLowerCase());
    });
  }, [profiles, search]);

  const handleRemovalProfileDetailsOpen = (profile: RemovalProfile) => {
    setPageParams({ action: "view", removalProfile: profile.id });
  };

  const columns = useMemo<Column<RemovalProfile>[]>(
    () => [
      {
        ...LIST_TITLE_COLUMN_PROPS,
        Cell: ({ row: { original } }: CellProps<RemovalProfile>) => (
          <ListTitle>
            <Button
              type="button"
              appearance="link"
              onClick={() => {
                handleRemovalProfileDetailsOpen(original);
              }}
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
        Cell: ({ row: { original } }: CellProps<RemovalProfile>) => (
          <>
            {accessGroupOptions.find(
              (option) => option.value === original.access_group,
            )?.label ?? original.access_group}
          </>
        ),
      },
      {
        accessor: "tags",
        Header: "Tags",
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
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original } }: CellProps<RemovalProfile>) => (
          <RemovalProfileListActions profile={original} />
        ),
      },
    ],
    [expandedRowIndex, accessGroupOptions.length],
  );

  return (
    <div ref={getTableRowsRef}>
      <ResponsiveTable
        columns={columns}
        data={filteredProfiles}
        emptyMsg={`No removal profiles found with the search: "${search}"`}
        getCellProps={getCellProps(expandedRowIndex)}
        getRowProps={getRowProps(expandedRowIndex)}
      />
    </div>
  );
};

export default RemovalProfileList;
