import { FC, useMemo } from "react";
import { CellProps, Column } from "react-table";
import { ModularTable } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import ScriptListActions from "../ScriptListActions";
import { Script } from "../types";
import { LOADING_SCRIPT } from "./constants";
import { getCellProps } from "./helpers";
import classes from "./ScriptList.module.scss";

interface ScriptListProps {
  isScriptsLoading: boolean;
  scripts: Script[];
}

const ScriptList: FC<ScriptListProps> = ({ isScriptsLoading, scripts }) => {
  const scriptsData = useMemo<Script[]>(
    () => (isScriptsLoading ? [LOADING_SCRIPT] : scripts),
    [isScriptsLoading, scripts],
  );

  const columns = useMemo<Column<Script>[]>(
    () => [
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ row }: CellProps<Script>) =>
          row.original.title === LOADING_SCRIPT.title ? (
            <LoadingState />
          ) : (
            row.original.title
          ),
      },
      {
        Header: "Access group",
        accessor: "access_group",
        className: classes.accessGroup,
      },
      {
        Header: "Creator",
        accessor: "creator.name",
        className: classes.creator,
      },
      {
        accessor: "id",
        className: classes.actions,
        Cell: ({ row }: CellProps<Script>) => (
          <ScriptListActions script={row.original} />
        ),
      },
    ],
    [scriptsData],
  );

  return (
    <ModularTable
      columns={columns}
      data={scriptsData}
      getCellProps={getCellProps}
    />
  );
};

export default ScriptList;
