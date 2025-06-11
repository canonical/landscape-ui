import LoadingState from "@/components/layout/LoadingState";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, ModularTable } from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { lazy, Suspense, useMemo, useState } from "react";
import type { CellProps, Column } from "react-table";
import { useGetAutoinstallFile } from "../../api";
import type { AutoinstallFile } from "../../types";
import type { AutoinstallFileVersionInfo } from "../../types/AutoinstallFile";
import AutoinstallFileSidePanelTitle from "../AutoinstallFileSidePanelTitle";

const AutoinstallFileVersion = lazy(
  async () => import("../AutoinstallFileVersion"),
);

interface AutoinstallFileVersionHistoryProps {
  readonly file: AutoinstallFile;
  readonly viewVersionHistory: () => void;
}

const AutoinstallFileVersionHistory: FC<AutoinstallFileVersionHistoryProps> = ({
  file,
  viewVersionHistory,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const { autoinstallFile, isAutoinstallFileLoading } = useGetAutoinstallFile({
    id: file.id,
    with_metadata: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const versions = autoinstallFile ? autoinstallFile.metadata.versions : [];

  const currentVersions = versions.slice(
    currentPage - 1,
    currentPage * pageSize,
  );

  const columns = useMemo<Column<AutoinstallFileVersionInfo>[]>(
    () => [
      {
        accessor: "version",
        Header: "Version",
        Cell: ({
          row: { original: versionInfo },
        }: CellProps<AutoinstallFileVersionInfo>): ReactNode => {
          const openVersionPanel = (): void => {
            setSidePanelContent(
              <AutoinstallFileSidePanelTitle
                file={file}
                version={versionInfo.version}
              />,
              <Suspense fallback={<LoadingState />}>
                <AutoinstallFileVersion
                  file={file}
                  goBack={viewVersionHistory}
                  versionInfo={versionInfo}
                />
              </Suspense>,
            );
          };

          return (
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top"
              onClick={openVersionPanel}
            >
              Version {versionInfo.version}
            </Button>
          );
        },
      },
      {
        accessor: "created_at",
        Header: "Created at",
        Cell: ({
          row: {
            original: { created_at },
          },
        }: CellProps<AutoinstallFileVersionInfo>): ReactNode => (
          <div className="font-monospace">
            {moment(created_at).format(DISPLAY_DATE_TIME_FORMAT)}
          </div>
        ),
      },
    ],
    [],
  );

  if (isAutoinstallFileLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <ModularTable columns={columns} data={currentVersions} />

      <SidePanelTablePagination
        currentItemCount={currentVersions.length}
        currentPage={currentPage}
        pageSize={pageSize}
        paginate={setCurrentPage}
        setPageSize={setPageSize}
        totalItems={versions.length}
      />
    </>
  );
};

export default AutoinstallFileVersionHistory;
