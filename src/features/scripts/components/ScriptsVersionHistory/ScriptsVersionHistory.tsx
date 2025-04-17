/* eslint-disable @typescript-eslint/no-unused-vars */
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, ModularTable } from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { lazy, Suspense, useMemo } from "react";
import type { CellProps, Column } from "react-table";
import { useGetScriptVersions } from "../../api";
import type { ScriptVersion, SingleScript } from "../../types";

const ScriptVersionHistoryDetails = lazy(
  async () => import("../ScriptVersionHistoryDetails"),
);

interface ScriptsVersionHistoryProps {
  readonly script: SingleScript;
  readonly viewVersionHistory: () => void;
  readonly isArchived?: boolean;
}

const ScriptsVersionHistory: FC<ScriptsVersionHistoryProps> = ({
  script,
  viewVersionHistory,
  isArchived = false,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const { versions, isVersionsLoading } = useGetScriptVersions(script.id);

  const columns = useMemo<Column<ScriptVersion>[]>(
    () => [
      {
        accessor: "version_number",
        Header: "Version",
        Cell: ({ row: { original } }: CellProps<ScriptVersion>): ReactNode => {
          const openVersionPanel = (): void => {
            setSidePanelContent(
              original.title,
              <Suspense fallback={<LoadingState />}>
                <ScriptVersionHistoryDetails
                  scriptVersion={original}
                  goBack={viewVersionHistory}
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
              Version {original.version_number}
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
        }: CellProps<ScriptVersion>): ReactNode => (
          <div>{moment(created_at).format(DISPLAY_DATE_TIME_FORMAT)}</div>
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
