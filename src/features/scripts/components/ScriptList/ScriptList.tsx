import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useAuth from "@/hooks/useAuth";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { Button } from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactElement } from "react";
import { lazy, Suspense, useMemo } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import { formatTitleCase } from "../../helpers";
import { useOpenScriptDetails } from "../../hooks";
import type { Script } from "../../types";
import ScriptListActions from "../ScriptListActions";
import { getCellProps, getRowProps } from "./helpers";
import classes from "./ScriptList.module.scss";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import ResponsiveTable from "@/components/layout/ResponsiveTable";

const ScriptDetails = lazy(async () => import("../ScriptDetails"));

interface ScriptListProps {
  readonly scripts: Script[];
}

const ScriptList: FC<ScriptListProps> = ({ scripts }) => {
  const { setSidePanelContent } = useSidePanel();
  const { isFeatureEnabled } = useAuth();
  const { getAccessGroupQuery } = useRoles();
  const { data: accessGroupsResponse } = getAccessGroupQuery();
  const { expandedRowIndex, getTableRowsRef, handleExpand } =
    useExpandableRow();

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

  const accessGroupOptions: SelectOption[] = (
    accessGroupsResponse?.data ?? []
  ).map(({ name, title }) => ({
    label: title,
    value: name,
  }));

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
            aria-label={`Show details of script ${original.title}`}
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
        accessor: "access_group",
        Header: "Access group",
        Cell: ({ row }: CellProps<Script>) =>
          accessGroupOptions.find(
            ({ value }) => row.original.access_group === value,
          )?.label ?? row.original.access_group,
      },
      {
        Header: "Associated profiles",
        id: "associated_profiles",
        className: classes.associatedProfiles,
        Cell: ({
          row: {
            original: { script_profiles },
            index,
          },
        }: CellProps<Script>): ReactElement<Element> =>
          script_profiles.length > 0 ? (
            <TruncatedCell
              content={script_profiles.map(({ id, title }) => (
                <Link
                  to="/scripts?tab=profiles"
                  state={{ scriptProfileId: id }}
                  key={id}
                  className="truncatedItem"
                >
                  {title}
                </Link>
              ))}
              isExpanded={index == expandedRowIndex}
              onExpand={() => {
                handleExpand(index);
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
        className: "date-cell",
        Cell: ({
          row: { original },
        }: CellProps<Script>): ReactElement<Element> => (
          <div>
            <div className="font-monospace">
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
        className: "date-cell",
        Cell: ({
          row: { original },
        }: CellProps<Script>): ReactElement<Element> => (
          <div>
            <div className="font-monospace">
              {moment(original.last_edited_at).format(DISPLAY_DATE_TIME_FORMAT)}
            </div>
            <div className="u-text--muted p-text--small u-no-margin--bottom">
              {original.last_edited_by.name}
            </div>
          </div>
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original } }: CellProps<Script>): ReactElement => (
          <ScriptListActions script={original} />
        ),
      },
    ];

    return isFeatureEnabled("script-profiles")
      ? result
      : result.filter((column) => column.id !== "associated_profiles");
  }, [scripts, accessGroupOptions, expandedRowIndex]);

  return (
    <div ref={getTableRowsRef}>
      <ResponsiveTable
        columns={columns}
        data={scripts}
        getCellProps={getCellProps(expandedRowIndex)}
        getRowProps={getRowProps(expandedRowIndex)}
        minWidth={1200}
      />
    </div>
  );
};

export default ScriptList;
