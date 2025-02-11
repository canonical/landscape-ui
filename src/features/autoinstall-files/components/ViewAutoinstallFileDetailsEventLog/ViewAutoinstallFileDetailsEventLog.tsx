import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import { ModularTable } from "@canonical/react-components";
import type { AutoinstallFileEvent } from "../../types";
import classes from "./ViewAutoinstallFileDetailsEventLog.module.scss";

const ViewAutoinstallFileDetailsEventLog: FC<{
  readonly events: AutoinstallFileEvent[];
}> = ({ events }) => {
  const columns = useMemo<Column<AutoinstallFileEvent>[]>(
    () => [
      {
        accessor: "description",
        Header: "Description",
        Cell: ({
          row: {
            original: { description },
          },
        }: CellProps<AutoinstallFileEvent>) => <div>{description}</div>,
      },
      {
        accessor: "author",
        className: classes.cell,
        Header: "Author",
        Cell: ({
          row: {
            original: { author },
          },
        }: CellProps<AutoinstallFileEvent>) => <div>{author}</div>,
      },
      {
        accessor: "createdAt",
        className: classes.cell,
        Header: "Created at",
        Cell: ({
          row: {
            original: { createdAt },
          },
        }: CellProps<AutoinstallFileEvent>) => <div>{createdAt}</div>,
      },
    ],
    [events],
  );

  return <ModularTable columns={columns} data={events} />;
};

export default ViewAutoinstallFileDetailsEventLog;
