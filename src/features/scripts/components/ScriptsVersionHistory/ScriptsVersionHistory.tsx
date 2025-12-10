import LoadingState from "@/components/layout/LoadingState";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import useSidePanel from "@/hooks/useSidePanel";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import { Button, ModularTable } from "@canonical/react-components";
import type { FC, ReactNode } from "react";
import { lazy, Suspense, useMemo, useState } from "react";
import type { CellProps, Column } from "react-table";
import { useGetScriptVersions } from "../../api";
import { getAuthorInfo } from "../../helpers";
import type { SingleScript, TruncatedScriptVersion } from "../../types";
import classes from "./ScriptsVersionHistory.module.scss";

const ScriptVersionHistoryDetails = lazy(
  async () => import("../ScriptVersionHistoryDetails"),
);

interface ScriptsVersionHistoryProps {
  readonly script: SingleScript;
  readonly viewVersionHistory: () => void;
}

const ScriptsVersionHistory: FC<ScriptsVersionHistoryProps> = ({
  script,
  viewVersionHistory,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const { setSidePanelContent } = useSidePanel();
  const { versions, isVersionsLoading, count } = useGetScriptVersions({
    scriptId: script.id,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const openVersionPanel = (scriptVersion: TruncatedScriptVersion): void => {
    setSidePanelContent(
      scriptVersion.title,
      <Suspense fallback={<LoadingState />}>
        <ScriptVersionHistoryDetails
          scriptId={script.id}
          scriptVersion={scriptVersion}
          goBack={viewVersionHistory}
          isArchived={script.status === "ARCHIVED"}
        />
      </Suspense>,
    );
  };

  const columns = useMemo<Column<TruncatedScriptVersion>[]>(
    () => [
      {
        accessor: "version_number",
        Header: "Version",
        className: classes.version,
        Cell: ({
          row: { original },
        }: CellProps<TruncatedScriptVersion>): ReactNode => {
          return (
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top"
              onClick={() => {
                openVersionPanel(original);
              }}
            >
              {original.version_number}
            </Button>
          );
        },
      },
      {
        accessor: "created_at",
        Header: "Created",
        Cell: ({
          row: { original },
        }: CellProps<TruncatedScriptVersion>): ReactNode => (
          <>
            {getAuthorInfo({
              author: original.created_by.name,
              date: original.created_at,
            })}
          </>
        ),
      },
    ],
    [versions],
  );

  if (isVersionsLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <ModularTable columns={columns} data={versions} />
      <SidePanelTablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        paginate={handlePageChange}
        setPageSize={handlePageSizeChange}
        totalItems={count}
      />
    </>
  );
};

export default ScriptsVersionHistory;
