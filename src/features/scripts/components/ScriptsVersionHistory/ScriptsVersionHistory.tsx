import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, ModularTable } from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { lazy, Suspense, useMemo } from "react";
import type { CellProps, Column } from "react-table";
import { useGetScriptVersions } from "../../api";
import type { TruncatedScriptVersion, SingleScript } from "../../types";
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
  const { setSidePanelContent } = useSidePanel();
  const { versions, isVersionsLoading } = useGetScriptVersions(script.id);

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
            {moment(original.created_at).format(DISPLAY_DATE_TIME_FORMAT)} by{" "}
            {original.created_by.name}
          </>
        ),
      },
    ],
    [versions],
  );

  if (isVersionsLoading) {
    return <LoadingState />;
  }

  return <ModularTable columns={columns} data={versions} />;
};

export default ScriptsVersionHistory;
