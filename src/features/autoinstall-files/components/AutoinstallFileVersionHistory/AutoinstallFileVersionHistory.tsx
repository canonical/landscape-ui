import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Chip, ModularTable } from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";

import { useGetAutoinstallFile } from "../../api";
import type { AutoinstallFile } from "../../types";
import type { AutoinstallFileVersionInfo } from "../../types/AutoinstallFile";
import AutoinstallFileVersion from "../AutoinstallFileVersion";
import classes from "./AutoinstallFileVersionHistory.module.scss";

interface AutoinstallFileVersionHistoryProps {
  readonly file: AutoinstallFile;
  readonly goBack: () => void;
}

const AutoinstallFileVersionHistory: FC<AutoinstallFileVersionHistoryProps> = ({
  file,
  goBack,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const { autoinstallFile, isAutoinstallFileLoading } = useGetAutoinstallFile(
    file.id,
    {
      with_versions: true,
    },
  );

  const versions = autoinstallFile?.versions.toReversed() ?? [];

  const columns = useMemo<Column<AutoinstallFileVersionInfo>[]>(
    () => [
      {
        accessor: "version",
        Header: "Version",
        Cell: ({
          row: {
            original: { version },
          },
        }: CellProps<AutoinstallFileVersionInfo>): ReactNode => (
          <Button
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top"
            onClick={() => {
              setSidePanelContent(
                <div className={classes.container}>
                  {file.filename}, v{version}
                  {file.is_default && (
                    <Chip
                      value="default"
                      className="u-no-margin--bottom"
                      readOnly
                    />
                  )}
                </div>,
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
        }: CellProps<AutoinstallFileVersionInfo>): ReactNode => (
          <div>{moment(created_at).format(DISPLAY_DATE_TIME_FORMAT)}</div>
        ),
      },
    ],
    [versions],
  );

  if (isAutoinstallFileLoading) {
    return <LoadingState />;
  }

  return <ModularTable columns={columns} data={versions} />;
};

export default AutoinstallFileVersionHistory;
