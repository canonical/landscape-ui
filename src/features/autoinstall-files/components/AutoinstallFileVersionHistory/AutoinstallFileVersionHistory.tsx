import LoadingState from "@/components/layout/LoadingState";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import { Button, ModularTable } from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useMemo, useState } from "react";
import type { CellProps, Column } from "react-table";
import { useGetAutoinstallFile } from "../../api";
import type { AutoinstallFile } from "../../types";
import type { AutoinstallFileVersionInfo } from "../../types/AutoinstallFile";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";

interface AutoinstallFileVersionHistoryProps {
  readonly file: AutoinstallFile;
  readonly viewVersionHistory: () => void;
}

const AutoinstallFileVersionHistory: FC<AutoinstallFileVersionHistoryProps> = ({
  file,
  viewVersionHistory,
}) => {
  const { setPageParams, sidePath: parsedSidePath } = usePageParams();

  const { autoinstallFile, isAutoinstallFileLoading } = useGetAutoinstallFile({
    id: file.id,
    with_metadata: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

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
            setPageParams({
              sidePath: [...parsedSidePath, "view-version"],
              version: String(versionInfo.version),
            });
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
    [setPageParams, parsedSidePath],
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
