import ProfileAssociatedInstancesLink from "@/components/form/ProfileAssociatedInstancesLink";
import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { getTitleByName } from "@/utils/_helpers";
import { Button } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { RebootProfile } from "../../types";
import RebootProfilesListActions from "../RebootProfilesListActions";
import { getCellProps, getRowProps } from "./helpers";

interface RebootProfilesListProps {
  readonly profiles: RebootProfile[];
}

const RebootProfilesList: FC<RebootProfilesListProps> = ({ profiles }) => {
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

  const columns = useMemo<Column<RebootProfile>[]>(
    () => [
      {
        accessor: "title",
        Header: "Title",
        id: "title",
        meta: {
          ariaLabel: ({ original }) => `${original.title} profile title`,
        },
        Cell: ({ row: { original } }: CellProps<RebootProfile>) => (
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
        ),
      },
      {
        accessor: "access_group",
        Header: "access group",
        meta: {
          ariaLabel: ({ original }) => `${original.title} profile access group`,
        },
        Cell: ({ row: { original } }: CellProps<RebootProfile>) => (
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
        },
        Cell: ({ row: { original, index } }: CellProps<RebootProfile>) =>
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
        Header: "associated",
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} profile associated instances`,
        },
        Cell: ({
          row: { original: rebootProfile },
        }: CellProps<RebootProfile>) => (
          <ProfileAssociatedInstancesLink
            profile={rebootProfile}
            count={rebootProfile.num_computers}
            query={`reboot:${rebootProfile.id}`}
          />
        ),
      },
      {
        accessor: "scheduled_reboot",
        Header: "scheduled reboot",
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} profile next scheduled reboot`,
        },
        className: "date-cell",
        Cell: ({ row }: CellProps<RebootProfile>) => {
          return (
            <span className="font-monospace">
              {moment(row.original.next_run).format(DISPLAY_DATE_TIME_FORMAT)}
            </span>
          );
        },
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        meta: {
          ariaLabel: ({ original }) => `${original.title} profile actions`,
        },
        Cell: ({ row }: CellProps<RebootProfile>) => (
          <RebootProfilesListActions profile={row.original} />
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
    <div ref={getTableRowsRef}>
      <ResponsiveTable
        columns={columns}
        data={filteredProfiles}
        emptyMsg={`No profiles found with the search: "${search}"`}
        getCellProps={getCellProps(expandedRowIndex)}
        getRowProps={getRowProps(expandedRowIndex)}
      />
    </div>
  );
};

export default RebootProfilesList;
