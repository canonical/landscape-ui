import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, ModularTable } from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import useAutoinstallFiles from "../../hooks/useAutoinstallFiles";
import type { AutoinstallFile } from "../../types";
import AutoinstallFileVersion from "../AutoinstallFileVersion/AutoinstallFileVersion";

interface AutoinstallFileVersionHistoryProps {
  readonly file: AutoinstallFile;
  readonly goBack: () => void;
}

const AutoinstallFileVersionHistory: FC<AutoinstallFileVersionHistoryProps> = ({
  file,
  goBack,
}) => {
  const { getAutoinstallFileQuery } = useAutoinstallFiles();
  const { setSidePanelContent } = useSidePanel();

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
        }: CellProps<AutoinstallFile>): ReactNode => (
          <Button
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={() => {
              setSidePanelContent(
                `${file.filename}, v${version}`,
                <AutoinstallFileVersion
                  goBack={goBack}
                  id={file.id}
                  version={version}
                />,
              );
            }}
          >
            {version}
          </Button>
        ),
      },
      {
        accessor: "created_at",
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
