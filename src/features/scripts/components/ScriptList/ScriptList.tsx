import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, ModularTable } from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactElement } from "react";
import { lazy, Suspense, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import { useOnClickOutside } from "usehooks-ts";
import { formatTitleCase } from "../../helpers";
import { useOpenScriptDetails } from "../../hooks";
import type { Script } from "../../types";
import ScriptListContextualMenu from "../ScriptListContextualMenu";
import { getCellProps, getRowProps, getTableRowsRef } from "./helpers";
import classes from "./ScriptList.module.scss";
import useAuth from "@/hooks/useAuth";

const ScriptDetails = lazy(async () => import("../ScriptDetails"));

interface ScriptListProps {
  readonly scripts: Script[];
}

const ScriptList: FC<ScriptListProps> = ({ scripts }) => {
  const { setSidePanelContent } = useSidePanel();
  const { isFeatureEnabled } = useAuth();
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);

  const tableRowsRef = useRef<HTMLTableRowElement[]>([]);

  useOnClickOutside(
    {
      current:
        expandedRowIndex == null
          ? null
          : tableRowsRef.current[expandedRowIndex],
    },
    () => {
      setExpandedRowIndex(null);
    },
  );

  const openViewPanel = (script: Script) => {
    setSidePanelContent(
      script.title,
      <Suspense fallback={<LoadingState />}>
        <ScriptDetails scriptId={script.id} />
      </Suspense>,
    );
  };

  useOpenScriptDetails((profile) => {
    openViewPanel(profile);
  });

  const columns = useMemo<Column<Script>[]>(() => {
    const result = [
      {
        Header: "Name",
        id: "name",
        Cell: ({ row: { original } }: CellProps<Script>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={() => {
              openViewPanel(original);
            }}
          >
            {original.title}
          </Button>
        ),
      },
      {
        Header: "Status",
        id: "status",
        Cell: ({ row }: CellProps<Script>) => (
          <>{formatTitleCase(row.original.status)}</>
        ),
        getCellIcon: ({ row }: CellProps<Script>) => {
          if (row.original.status === "ACTIVE") {
            return "status-succeeded-small";
          }
          return "status-queued-small";
        },
      },
      {
        Header: "Associated profiles",
        id: "associated_profiles",
        Cell: ({
          row: {
            original: { script_profiles },
            index,
          },
        }: CellProps<Script>): ReactElement =>
          script_profiles.length > 0 ? (
            <TruncatedCell
              content={script_profiles.map(({ id, title }) => (
                <Link
                  to="/scripts?tab=profiles"
                  state={{ scriptProfileId: id }}
                  key={id}
                  className={classes.truncatedItem}
                >
                  {title}
                </Link>
              ))}
              isExpanded={index == expandedRowIndex}
              onExpand={() => {
                setExpandedRowIndex(index);
              }}
              showCount
            />
          ) : (
            <NoData />
          ),
      },
      {
        Header: "Created",
        id: "created_at",
        Cell: ({ row: { original } }: CellProps<Script>): ReactElement => (
          <div>
            <div>
              {moment(original.created_at).format(DISPLAY_DATE_TIME_FORMAT)}
            </div>
            <div className="u-text--muted p-text--small u-no-margin--bottom">
              {original.created_by.name}
            </div>
          </div>
        ),
      },
      {
        Header: "Last modified",
        id: "last_modified_at",
        Cell: ({ row: { original } }: CellProps<Script>): ReactElement => (
          <div>
            <div>
              {moment(original.last_edited_at).format(DISPLAY_DATE_TIME_FORMAT)}
            </div>
            <div className="u-text--muted p-text--small u-no-margin--bottom">
              {original.last_edited_by.name}
            </div>
          </div>
        ),
      },
      {
        Header: "Actions",
        className: classes.actions,
        Cell: ({ row: { original } }: CellProps<Script>): ReactElement => (
          <ScriptListContextualMenu script={original} />
        ),
      },
    ];

    return isFeatureEnabled("script-profiles")
      ? result
      : result.filter((column) => column.id !== "associated_profiles");
  }, [scripts, expandedRowIndex]);

  return (
    <div ref={getTableRowsRef(tableRowsRef)}>
      <ModularTable
        columns={columns}
        data={scripts}
        getCellProps={getCellProps(expandedRowIndex)}
        getRowProps={getRowProps(expandedRowIndex)}
      />
    </div>
  );
};

export default ScriptList;
