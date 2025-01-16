import TruncatedCell from "@/components/layout/TruncatedCell";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { getTableRows } from "@/features/usns";
import { ModularTable } from "@canonical/react-components";
import {
  CellProps,
  Column,
} from "@canonical/react-components/node_modules/@types/react-table";
import moment from "moment";
import { FC, useMemo, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { EventLog } from "../../types";
import classes from "./EventsLogList.module.scss";
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
        Header: "message",
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
        emptyMsg="No events found according to your search parameters."
      />
    </div>
  );
};

export default EventsLogList;
