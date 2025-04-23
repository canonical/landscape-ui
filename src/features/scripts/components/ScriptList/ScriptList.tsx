import type { FC, ReactElement } from "react";
import { lazy, Suspense, useMemo, useRef, useState } from "react";
import type { CellProps, Column } from "react-table";
import { Button, ModularTable } from "@canonical/react-components";
import type { Script } from "../../types";
import { getCellProps, getTableRows, handleRowProps } from "./helpers";
import classes from "./ScriptList.module.scss";
import ScriptListContextualMenu from "../ScriptListContextualMenu";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import TruncatedCell from "@/components/layout/TruncatedCell";
import NoData from "@/components/layout/NoData";
import { useOnClickOutside } from "usehooks-ts";
import type { ExpandedCell } from "./types";
import { Link } from "react-router";
import { formatTitleCase } from "../../helpers";
import { useOpenScriptDetails } from "../../hooks";

const ScriptDetails = lazy(async () => import("../ScriptDetails"));

interface ScriptListProps {
  readonly scripts: Script[];
}

const ScriptList: FC<ScriptListProps> = ({ scripts }) => {
  const [expandedCell, setExpandedCell] = useState<ExpandedCell>(null);
  const tableRowsRef = useRef<HTMLTableRowElement[]>([]);

  const { setSidePanelContent } = useSidePanel();

  const openViewPanel = (script: Script) => {
    setSidePanelContent(
      script.title,
      <Suspense fallback={<LoadingState />}>
        <ScriptDetails scriptId={script.id} />
      </Suspense>,
    );
  };

  useOnClickOutside(
    expandedCell?.column === "script_profiles"
      ? { current: tableRowsRef.current[expandedCell.row] }
      : [],
    (event) => {
      if (
        event.target instanceof Element &&
        !event.target.closest(`.${classes.truncatedItem}`)
      ) {
        setExpandedCell(null);
      }
    },
  );

  useOpenScriptDetails((profile) => {
    openViewPanel(profile);
  });

  const handleExpandCellClick = (columnId: string, rowIndex: number) => {
    setExpandedCell((prevState) => {
      if (prevState?.column === columnId && prevState.row === rowIndex) {
        return null;
      }
      return {
        column: columnId,
        row:
          prevState &&
          ["script_profiles"].includes(prevState.column) &&
          prevState.row < rowIndex
            ? rowIndex - 1
            : rowIndex,
      };
    });
  };

  const columns = useMemo<Column<Script>[]>(
    () => [
      {
        Header: "name",
        Cell: ({ row }: CellProps<Script>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={() => {
              openViewPanel(row.original);
            }}
          >
            {row.original.title}
          </Button>
        ),
      },
      {
        Header: "status",
        accessor: "status",
        Cell: ({ row }: CellProps<Script>) => (
          <>{formatTitleCase(row.original.status)}</>
        ),
        getCellIcon: ({ row: { original } }: CellProps<Script>) => {
          if (original.status === "ACTIVE") {
            return "status-succeeded-small";
          }
          return "status-queued-small";
        },
      },
      {
        Header: "associated profiles",
        accessor: "script_profiles",
        className: classes.associatedProfiles,
        Cell: ({ row: { original, index } }: CellProps<Script>) => {
          const scriptProfiles = original.script_profiles;

          return scriptProfiles.length > 0 ? (
            <TruncatedCell
              content={scriptProfiles.map((scriptProfile) => (
                <Link
                  to="/scripts?tab=profiles"
                  state={{ scriptProfileId: scriptProfile.id }}
                  key={scriptProfile.id}
                  className={classes.truncatedItem}
                >
                  {scriptProfile.title}
                </Link>
              ))}
              isExpanded={
                expandedCell?.column === "script_profiles" &&
                expandedCell.row === index
              }
              onExpand={() => {
                handleExpandCellClick("script_profiles", index);
              }}
            />
          ) : (
            <NoData />
          );
        },
      },
      {
        Header: "created",
        accessor: "created_by.name",
        Cell: ({ row }: CellProps<Script>): ReactElement => (
          <div>
            <div>
              {moment(row.original.created_at).format(DISPLAY_DATE_TIME_FORMAT)}
            </div>
            <div className="u-text--muted p-text--small u-no-margin--bottom">
              {row.original.created_by.name}
            </div>
          </div>
        ),
      },
      {
        Header: "last modified",
        accessor: "last_edited_by.name",
        Cell: ({ row }: CellProps<Script>): ReactElement => (
          <div>
            <div>
              {moment(row.original.last_edited_at).format(
                DISPLAY_DATE_TIME_FORMAT,
              )}
            </div>
            <div className="u-text--muted p-text--small u-no-margin--bottom">
              {row.original.last_edited_by.name}
            </div>
          </div>
        ),
      },
      {
        Header: "actions",
        accessor: "id",
        className: classes.actions,
        Cell: ({ row }: CellProps<Script>): ReactElement => (
          <ScriptListContextualMenu script={row.original} />
        ),
      },
    ],
    [scripts, expandedCell],
  );

  return (
    <div ref={getTableRows(tableRowsRef)}>
      <ModularTable
        columns={columns}
        data={scripts}
        getCellProps={getCellProps(expandedCell)}
        getRowProps={handleRowProps(expandedCell)}
        emptyMsg="No scripts found according to your search parameters"
      />
    </div>
  );
};

export default ScriptList;
