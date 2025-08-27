import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { SelectOption } from "@/types/SelectOption";
import { Button } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { RebootProfile } from "../../types";
import RebootProfileAssociatedInstancesLink from "../RebootProfileAssociatedInstancesLink";
import RebootProfilesListActions from "../RebootProfilesListActions";
import { getCellProps, getRowProps } from "./helpers";

interface RebootProfilesListProps {
  readonly profiles: RebootProfile[];
}

const RebootProfilesList: FC<RebootProfilesListProps> = ({ profiles }) => {
  const { search, setPageParams } = usePageParams();
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

  const handleRebootProfileDetailsOpen = (profile: RebootProfile) => {
    setPageParams({ sidePath: ["view"], profile: profile.id.toString() });
  };

  const columns = useMemo<Column<RebootProfile>[]>(
    () => [
      {
        accessor: "title",
        Header: "Title",
        Cell: ({ row: { original } }: CellProps<RebootProfile>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={() => {
              handleRebootProfileDetailsOpen(original);
            }}
          >
            {original.title}
          </Button>
        ),
      },
      {
        accessor: "access_group",
        Header: "access group",
        Cell: ({ row: { original } }: CellProps<RebootProfile>) => (
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
        Cell: ({
          row: { original: rebootProfile },
        }: CellProps<RebootProfile>) => (
          <RebootProfileAssociatedInstancesLink rebootProfile={rebootProfile} />
        ),
      },
      {
        accessor: "scheduled_reboot",
        Header: "scheduled reboot",
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
        Cell: ({ row }: CellProps<RebootProfile>) => (
          <RebootProfilesListActions profile={row.original} />
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
        emptyMsg={`No profiles found with the search: "${search}"`}
        getCellProps={getCellProps(expandedRowIndex)}
        getRowProps={getRowProps(expandedRowIndex)}
      />
    </div>
  );
};

export default RebootProfilesList;
