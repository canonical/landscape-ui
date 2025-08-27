import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { useMemo } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import { getStatusText, getTriggerText } from "../../helpers";
import type { ScriptProfile } from "../../types";
import ScriptProfileAssociatedInstancesLink from "../ScriptProfileAssociatedInstancesLink";
import ScriptProfilesListActions from "../ScriptProfilesListActions";
import { getCellProps, getRowProps } from "./helpers";

interface ScriptProfilesListProps {
  readonly profiles: ScriptProfile[];
}

const ScriptProfilesList: FC<ScriptProfilesListProps> = ({ profiles }) => {
  const { setPageParams } = usePageParams();
  const { expandedRowIndex, handleExpand, getTableRowsRef } =
    useExpandableRow();

  const columns = useMemo<Column<ScriptProfile>[]>(
    () => [
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin u-no-padding--top u-align-text--left"
            onClick={() => {
              setPageParams({
                sidePath: ["view"],
                profile: profile.id.toString(),
              });
            }}
          >
            {profile.title}
          </Button>
        ),
      },

      {
        Header: "Status",
        accessor: "archived",
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) =>
          getStatusText(profile),
        getCellIcon: ({
          row: {
            original: { archived },
          },
        }: CellProps<ScriptProfile>) =>
          archived ? "status-queued-small" : "status-succeeded-small",
      },

      {
        Header: "Associated instances",
        accessor: "all_computers",
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) => (
          <ScriptProfileAssociatedInstancesLink scriptProfile={profile} />
        ),
      },

      {
        Header: "Tags",
        accessor: "tags",
        Cell: ({
          row: { original: profile, index },
        }: CellProps<ScriptProfile>) => {
          if (profile.all_computers) {
            return "All instances";
          }

          if (profile.tags.length === 0) {
            return <NoData />;
          }

          return (
            <TruncatedCell
              content={profile.tags.map((tag) => (
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
          );
        },
      },

      {
        Header: "Trigger",
        accessor: "trigger",
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) =>
          getTriggerText(profile),
      },

      {
        Header: "Last run",
        accessor: "activities.last_activity.creation_time",
        className: "date-cell",
        Cell: ({
          row: {
            original: {
              activities: { last_activity: activity },
            },
          },
        }: CellProps<ScriptProfile>) =>
          activity ? (
            <Link
              className="font-monospace"
              to={`/activities?query=parent-id%3A${activity.id}`}
            >
              {moment(activity.creation_time)
                .utc()
                .format(DISPLAY_DATE_TIME_FORMAT)}{" "}
            </Link>
          ) : (
            <NoData />
          ),
      },

      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) => (
          <ScriptProfilesListActions scriptProfile={profile} />
        ),
      },
    ],
    [expandedRowIndex],
  );

  return (
    <div ref={getTableRowsRef}>
      <ResponsiveTable
        columns={columns}
        data={profiles}
        emptyMsg="No script profiles found according to your search parameters."
        getCellProps={getCellProps(expandedRowIndex)}
        getRowProps={getRowProps(expandedRowIndex)}
        minWidth={1200}
      />
    </div>
  );
};

export default ScriptProfilesList;
