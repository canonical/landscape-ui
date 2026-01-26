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
import type { UpgradeProfile } from "../../types";
import UpgradeProfileListActions from "../UpgradeProfileListActions";
import { getCellProps, getRowProps } from "./helpers";

interface UpgradeProfileListProps {
  readonly profiles: UpgradeProfile[];
}

const UpgradeProfileList: FC<UpgradeProfileListProps> = ({ profiles }) => {
  const { search } = usePageParams();
  const { createPageParamsSetter } = usePageParams();
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

  const columns = useMemo<Column<UpgradeProfile>[]>(
    () => [
      {
        ...LIST_TITLE_COLUMN_PROPS,
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} profile title and name`,
        },
        Cell: ({ row: { original } }: CellProps<UpgradeProfile>) => (
          <ListTitle>
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top u-align-text--left"
              onClick={createPageParamsSetter({
                sidePath: ["view"],
                profile: original.id.toString(),
              })}
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
          ariaLabel: ({ original }) => `${original.title} profile access group`,
        },
        Cell: ({ row: { original } }: CellProps<UpgradeProfile>) => (
          <>
            {getTitleByName(original.access_group, getAccessGroupQueryResult)}
          </>
        ),
      },
      {
        accessor: "tags",
        Header: "Tags",
        meta: {
          ariaLabel: ({ original }) => `${original.title} profile tags`,
          isExpandable: true,
        },
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
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} profile associated instances`,
        },
        Cell: ({
          row: { original: upgradeProfile },
        }: CellProps<UpgradeProfile>) => {
          return (
            <ProfileAssociatedInstancesLink
              count={upgradeProfile.computers.num_associated_computers}
              profile={upgradeProfile}
              query={`upgrade:${upgradeProfile.id}`}
            />
          );
        },
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original } }: CellProps<UpgradeProfile>) => (
          <UpgradeProfileListActions profile={original} />
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
      emptyMsg={`No upgrade profiles found with the search: "${search}"`}
      getCellProps={getCellProps(expandedRowIndex)}
      getRowProps={getRowProps(expandedRowIndex)}
    />
  );
};

export default UpgradeProfileList;
