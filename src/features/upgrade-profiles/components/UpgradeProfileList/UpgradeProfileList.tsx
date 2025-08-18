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
import type { SelectOption } from "@/types/SelectOption";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { UpgradeProfile } from "../../types";
import UpgradeProfileListActions from "../UpgradeProfileListActions";
import { getCellProps, getRowProps } from "./helpers";

interface UpgradeProfileListProps {
  readonly profiles: UpgradeProfile[];
}

const UpgradeProfileList: FC<UpgradeProfileListProps> = ({ profiles }) => {
  const { search } = usePageParams();
  const { setPageParams } = usePageParams();
  const { getAccessGroupQuery } = useRoles();
  const { expandedRowIndex, handleExpand, getTableRowsRef } =
    useExpandableRow();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
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

  const handleUpgradeProfileDetailsOpen = (profile: UpgradeProfile) => {
    setPageParams({ sidePath: ["view"], upgradeProfile: profile.id });
  };

  const columns = useMemo<Column<UpgradeProfile>[]>(
    () => [
      {
        ...LIST_TITLE_COLUMN_PROPS,
        Cell: ({ row: { original } }: CellProps<UpgradeProfile>) => (
          <ListTitle>
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top u-align-text--left"
              onClick={() => {
                handleUpgradeProfileDetailsOpen(original);
              }}
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
        Cell: ({ row: { original } }: CellProps<UpgradeProfile>) => (
          <>
            {accessGroupOptions.find(
              ({ value }) => value === original.access_group,
            )?.label ?? original.access_group}
          </>
        ),
      },
      {
        accessor: "tags",
        Header: "Tags",
        Cell: ({ row: { original, index } }: CellProps<UpgradeProfile>) =>
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
        Cell: ({ row: { original } }: CellProps<UpgradeProfile>) => (
          <UpgradeProfileListActions profile={original} />
        ),
      },
    ],
    [accessGroupOptions.length, expandedRowIndex],
  );

  return (
    <div ref={getTableRowsRef}>
      <ResponsiveTable
        columns={columns}
        data={filteredProfiles}
        emptyMsg={`No upgrade profiles found with the search: "${search}"`}
        getCellProps={getCellProps(expandedRowIndex)}
        getRowProps={getRowProps(expandedRowIndex)}
      />
    </div>
  );
};

export default UpgradeProfileList;
