import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { EventLog } from "@/types/EventLogs";
import { ModularTable } from "@canonical/react-components";
import moment from "moment";
import { FC, useMemo } from "react";
import { CellProps, Column } from "react-table";
import classes from "./EventLogsList.module.scss";
import OverflowingCell from "@/components/layout/OverflowingCell";
interface EventLogsListProps {
  eventLogs: EventLog[];
}

const EventLogsList: FC<EventLogsListProps> = ({ eventLogs }) => {
  const columns = useMemo<Column<EventLog>[]>(
    () => [
      {
        accessor: "creation_time",
        Header: "creation time",
        Cell: ({ row }: CellProps<EventLog>) => (
          <>
            {moment(row.original.creation_time).format(
              DISPLAY_DATE_TIME_FORMAT,
            )}
          </>
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
        Header: "event log message",
        Cell: ({ row }: CellProps<EventLog>) => {
          return row.original.message.length < 120 ? (
            <>{row.original.message}</>
          ) : (
            <OverflowingCell items={[row.original.message]} />
          );
        },
      },
    ],
    [eventLogs],
  );

  return <ModularTable columns={columns} data={eventLogs} sortable={true} />;
};

export default EventLogsList;
