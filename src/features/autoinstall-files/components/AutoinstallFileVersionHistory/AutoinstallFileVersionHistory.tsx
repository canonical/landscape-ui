import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, ModularTable } from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import { useAutoinstallFile } from "../../api";
import type { AutoinstallFile, TabId } from "../../types";
import AutoinstallFileVersion from "../AutoinstallFileVersion/AutoinstallFileVersion";
import classes from "./AutoinstallFileVersionHistory.module.scss";

interface AutoinstallFileVersionHistoryProps {
  readonly file: AutoinstallFile;
  readonly openDetailsPanel: (defaultTabId: TabId) => void;
}

const AutoinstallFileVersionHistory: FC<AutoinstallFileVersionHistoryProps> = ({
  file,
  openDetailsPanel,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const files = [...Array(file.version)].map((_, i) => {
    return useAutoinstallFile(file.id, { version: i + 1 });
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
                  goBack={() => {
                    openDetailsPanel("version-history");
                  }}
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

  if (files.some((file) => !file)) {
    return <LoadingState />;
  }

  return <ModularTable columns={columns} data={files as AutoinstallFile[]} />;
};

export default AutoinstallFileVersionHistory;
