import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { RemovalProfile } from "../../types";
import RemovalProfileListActions from "../RemovalProfileListActions";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import { getCellProps, getRowProps } from "./helpers";
import ResponsiveTable from "@/components/layout/ResponsiveTable";

const RemovalProfileDetails = lazy(
  async () => import("../RemovalProfileDetails"),
);

interface RemovalProfileListProps {
  readonly profiles: RemovalProfile[];
}

const RemovalProfileList: FC<RemovalProfileListProps> = ({ profiles }) => {
  const { search } = usePageParams();
  const { setSidePanelContent } = useSidePanel();
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
    setSidePanelContent(
      profile.title,
      <Suspense fallback={<LoadingState />}>
        <RemovalProfileDetails
          accessGroupOptions={accessGroupOptions}
          profile={profile}
        />
      </Suspense>,
    );
  };

  const columns = useMemo<Column<RemovalProfile>[]>(
    () => [
      {
        accessor: "title",
        Header: "Name",
        Cell: ({ row: { original } }: CellProps<RemovalProfile>) => (
          <Button
            type="button"
            appearance="link"
            onClick={() => {
              handleRemovalProfileDetailsOpen(original);
            }}
            className="u-no-margin--bottom u-no-padding--top"
            aria-label={`Open "${original.title}" profile details`}
          >
            {original.title}
          </Button>
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
    [expandedRowIndex],
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
