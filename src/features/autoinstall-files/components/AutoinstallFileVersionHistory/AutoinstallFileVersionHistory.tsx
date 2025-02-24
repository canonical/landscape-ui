import { ModularTable } from "@canonical/react-components";
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

  const files = [...Array(file.version)].map((_, i) => {
    const { data: { data: pastFile } = { data: {} as AutoinstallFile } } =
      getAutoinstallFileQuery({ id: file.id, version: i + 1 });

    return pastFile;
  });

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
        }: CellProps<AutoinstallFile>): ReactNode => <div>{created_at}</div>,
      },
    ],
    [files],
  );

  return <ModularTable columns={columns} data={files} />;
};

export default AutoinstallFileVersionHistory;
