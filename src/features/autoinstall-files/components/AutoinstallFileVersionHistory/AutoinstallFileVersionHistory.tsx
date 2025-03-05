import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, ModularTable } from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import { useGetAutoinstallFile } from "../../api";

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
  const { setSidePanelContent } = useSidePanel();

  const fileQueries = [...Array(file.version)].map((_, i) => {
    return useGetAutoinstallFile(file.id, { version: i + 1 });
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
    [fileQueries],
  );

  if (fileQueries.some((query) => query.isAutoinstallFileLoading)) {
    return <LoadingState />;
  }

  return (
    <ModularTable
      columns={columns}
      data={fileQueries.map(
        (query) => query.autoinstallFile as AutoinstallFile,
      )}
    />
  );
};

export default AutoinstallFileVersionHistory;
