import TruncatedCell from "@/components/layout/TruncatedCell";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import moment from "moment";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { EventLog } from "../../types";
import classes from "./EventsLogList.module.scss";
import { getCellProps, getRowProps } from "./helpers";
import ResponsiveTable from "@/components/layout/ResponsiveTable";

interface EventsLogListProps {
  readonly eventsLog: EventLog[];
}

const EventsLogList: FC<EventsLogListProps> = ({ eventsLog }) => {
  const { expandedRowIndex, getTableRowsRef, handleExpand } =
    useExpandableRow();

  const columns = useMemo<Column<EventLog>[]>(
    () => [
      {
        accessor: "creation_time",
        Header: "creation time",
        Cell: ({ row }: CellProps<EventLog>) => (
          <span className="font-monospace">
            {moment(row.original.creation_time).format(
              DISPLAY_DATE_TIME_FORMAT,
            )}
          </span>
        ),
      },
      {
        accessor: "person_name",
        Header: "username",
        Cell: ({ row }: CellProps<EventLog>) => <>{row.original.person_name}</>,
      },
      {
        accessor: "entity_type",
        Header: "entity type",
        Cell: ({ row }: CellProps<EventLog>) => <>{row.original.entity_type}</>,
      },
      {
        accessor: "entity_name",
        Header: "entity name",
        Cell: ({ row }: CellProps<EventLog>) => <>{row.original.entity_name}</>,
      },
      {
        accessor: "message",
        className: classes.message,
        Header: "message",
        Cell: ({ row: { original, index } }: CellProps<EventLog>) => (
          <TruncatedCell
            content={original.message}
            isExpanded={index === expandedRowIndex}
            onExpand={() => {
              handleExpand(index);
            }}
          />
        ),
      },
    ],
    [eventsLog, expandedRowIndex],
  );

  return (
    <div ref={getTableRowsRef}>
      <ResponsiveTable
        columns={columns}
        data={eventsLog}
        emptyMsg="No events found according to your search parameters."
        getCellProps={getCellProps(expandedRowIndex)}
        getRowProps={getRowProps(expandedRowIndex)}
        minWidth={1200}
      />
    </div>
  );
};

export default EventsLogList;
