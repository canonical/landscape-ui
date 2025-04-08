import type { FC, ReactElement } from "react";
import { lazy, useMemo } from "react";
import type { CellProps, Column } from "react-table";
import { Button, ModularTable } from "@canonical/react-components";
import type { Script } from "../../types";
import { getCellProps } from "./helpers";
import classes from "./ScriptList.module.scss";
import ScriptListContextualMenu from "../ScriptListContextualMenu";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";

const ScriptDetails = lazy(async () => import("../ScriptDetails"));

interface ScriptListProps {
  readonly scripts: Script[];
}

const ScriptList: FC<ScriptListProps> = ({ scripts }) => {
  const { setSidePanelContent } = useSidePanel();

  const openViewPanel = (script: Script) => {
    setSidePanelContent(script.title, <ScriptDetails scriptId={script.id} />);
  };

  const columns = useMemo<Column<Script>[]>(
    () => [
      {
        Header: "Name",
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
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Created",
        Cell: ({ row }: CellProps<Script>): ReactElement => (
          <div>
            <div>{moment().format(DISPLAY_DATE_TIME_FORMAT)}</div>
            <div className="u-text--muted p-text--small u-no-margin--bottom">
              {row.original.creator.name}
            </div>
          </div>
        ),
      },
      {
        Header: "Last modified",
        Cell: ({ row }: CellProps<Script>): ReactElement => (
          <div>
            <div>{moment().format(DISPLAY_DATE_TIME_FORMAT)}</div>
            <div className="u-text--muted p-text--small u-no-margin--bottom">
              {row.original.creator.name}
            </div>
          </div>
        ),
      },
      {
        Header: "Actions",
        accessor: "id",
        className: classes.actions,
        Cell: ({ row }: CellProps<Script>): ReactElement => (
          <ScriptListContextualMenu script={row.original} />
        ),
      },
    ],
    [scripts],
  );

  return (
    <ModularTable
      columns={columns}
      data={scripts}
      getCellProps={getCellProps}
    />
  );
};

export default ScriptList;
