import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { ModularTable } from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import useAutoinstallFiles from "../../hooks/useAutoinstallFiles";
import type { AutoinstallFile } from "../../types";
import classes from "./AutoinstallFileVersionHistory.module.scss";

const AutoinstallFileVersionHistory: FC<{
  readonly file: AutoinstallFile;
}> = ({ file }) => {
  const { getAutoinstallFileQuery } = useAutoinstallFiles();

  const filesQuery = [...Array(file.version)].map((_, i) => {
    const {
      data: { data: pastFile } = { data: {} as AutoinstallFile },
      isLoading,
    } = getAutoinstallFileQuery({ id: file.id, version: i + 1 });

    return [pastFile, isLoading] as [AutoinstallFile, boolean];
  });

  const files = filesQuery.map(([file]) => file);

  const columns = useMemo<Column<AutoinstallFile>[]>(
    () => [
      {
        accessor: "version",
        Header: "Version",
        Cell: ({
          row: {
            original: { version },
          },
        }: CellProps<AutoinstallFile>): ReactNode => <div>{version}</div>,
      },
      {
        accessor: "author",
        className: classes.cell,
        Header: "Author",
        Cell: (): ReactNode => <div>Stephanie Domas</div>,
      },
      {
        accessor: "created_at",
        className: classes.cell,
        Header: "Created at",
        Cell: ({
          row: {
            original: { created_at },
          },
        }: CellProps<AutoinstallFile>): ReactNode => (
          <div>{moment(created_at).format(DISPLAY_DATE_TIME_FORMAT)}</div>
        ),
      },
    ],
    [files],
  );

  if (filesQuery.some(([_, isLoading]) => isLoading)) {
    return <LoadingState />;
  }

  return <ModularTable columns={columns} data={files} />;
};

export default AutoinstallFileVersionHistory;
