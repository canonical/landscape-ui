import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Chip, ModularTable } from "@canonical/react-components";
import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import useAutoinstallFiles from "../../hooks/useAutoinstallFiles";
import type { AutoinstallFile } from "../../types";
import type {
  AutoinstallFileVersionInfo,
  AutoinstallFileWithVersions,
} from "../../types/AutoinstallFile";
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
  const { getAutoinstallFileQuery } = useAutoinstallFiles();
  const { setSidePanelContent } = useSidePanel();

  const {
    data: { data: { versions } } = {
      data: { versions: [] as AutoinstallFileVersionInfo[] },
    },
    isLoading,
  } = getAutoinstallFileQuery({
    id: file.id,
    with_versions: true,
  }) as UseQueryResult<AxiosResponse<AutoinstallFileWithVersions>>;

  const columns = useMemo<Column<AutoinstallFileVersionInfo>[]>(
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

  if (isLoading) {
    return <LoadingState />;
  }

  return <ModularTable columns={columns} data={versions} />;
};

export default AutoinstallFileVersionHistory;
