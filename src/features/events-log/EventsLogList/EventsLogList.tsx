import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { EventLog } from "@/types/EventLogs";
import { ModularTable } from "@canonical/react-components";
import moment from "moment";
import { FC, useMemo, useRef, useState } from "react";
import { CellProps, Column } from "react-table";
import classes from "./EventsLogList.module.scss";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { useOnClickOutside } from "usehooks-ts";
import { getTableRows } from "@/features/usns/UsnList/helpers";
import { handleEventLogsCellProps, handleRowProps } from "./helpers";
interface EventsLogListProps {
  eventsLog: EventLog[];
}

const EventsLogList: FC<EventsLogListProps> = ({ eventsLog }) => {
  const [expandedEvent, setExpandedEvent] = useState<string>("");
  const [expandedRowIndex, setExpandedRowIndex] = useState(-1);
  const tableRowsRef = useRef<HTMLTableRowElement[]>([]);

  useOnClickOutside(
    {
      current:
        expandedRowIndex !== -1 ? tableRowsRef.current[expandedRowIndex] : null,
    },
    () => setExpandedRowIndex(-1),
  );

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
        Cell: ({ row: { original, index } }: CellProps<EventLog>) => (
          <TruncatedCell
            content={original.message}
            isExpanded={index === expandedRowIndex}
            onExpand={() => {
              setExpandedEvent("");
              setExpandedRowIndex(expandedEvent ? index - 1 : index);
            }}
          />
        ),
      },
    ],
    [eventsLog, expandedRowIndex],
  );

  return (
    <div ref={getTableRows(tableRowsRef)}>
      <ModularTable
        getCellProps={handleEventLogsCellProps(expandedRowIndex)}
        getRowProps={handleRowProps(expandedRowIndex)}
        columns={columns}
        data={eventsLog}
        sortable={true}
        emptyMsg="No events found"
      />
    </div>
  );
};

export default EventsLogList;
