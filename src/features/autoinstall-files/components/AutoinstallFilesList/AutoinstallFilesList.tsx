import type { FC } from "react";
import { useMemo } from "react";
import { Button, ModularTable } from "@canonical/react-components";
import type { AutoinstallFile } from "../../types";
import useSidePanel from "@/hooks/useSidePanel";
import { getCellProps } from "./helpers";
import usePageParams from "@/hooks/usePageParams";
import classes from "./AutoinstallFilesList.module.scss";
import AutoinstallFilesListContextualMenu from "../AutoinstallFilesListContextualMenu";
import ViewAutoinstallFileDetailsPanel from "../ViewAutoinstallFileDetailsPanel";
import type { CellProps, Column } from "react-table";
import AutoinstallFileEmployeeGroupsList from "../AutoinstallFileEmployeeGroupsList";

interface AutoinstallFilesListProps {
  readonly autoinstallFiles: AutoinstallFile[];
  readonly defaultFile: AutoinstallFile;
}

const AutoinstallFilesList: FC<AutoinstallFilesListProps> = ({
  autoinstallFiles,
  defaultFile,
}) => {
  const { employeeGroups, search } = usePageParams();
  const { setSidePanelContent } = useSidePanel();

  const handleAutoinstallFileDetailsOpen = (file: AutoinstallFile) => {
    const isDefault = file === defaultFile;

    setSidePanelContent(
      `${file.name}${isDefault ? " (default)" : ""}`,
      <ViewAutoinstallFileDetailsPanel file={file} isDefault={isDefault} />,
      "large",
    );
  };

  const files = useMemo(() => {
    return autoinstallFiles.filter((file) => {
      return (
        file.filename.toLowerCase().includes(search.toLowerCase()) &&
        file.employeeGroupsAssociated.some((group) => {
          return employeeGroups.length === 0 || employeeGroups.includes(group);
        })
      );
    });
  }, [autoinstallFiles, employeeGroups, search]);

  const columns = useMemo<Column<AutoinstallFile>[]>(
    () => [
      {
        accessor: "name",
        className: classes.cell,
        Header: "Name",
        Cell: ({ row: { original } }: CellProps<AutoinstallFile>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={() => handleAutoinstallFileDetailsOpen(original)}
          >
            {original.filename}
            {original === defaultFile && " (default)"}
          </Button>
        ),
      },
      {
        accessor: "employeeGroupsAssociated",
        className: classes.cell,
        Header: "Employee Groups Associated",
        Cell: ({
          row: {
            original: { employeeGroupsAssociated },
          },
        }: CellProps<AutoinstallFile>) => (
          <AutoinstallFileEmployeeGroupsList
            groups={employeeGroupsAssociated}
          />
        ),
      },
      {
        accessor: "lastModified",
        className: classes.cell,
        Header: "Last modified",
        Cell: ({
          row: {
            original: { lastModified },
          },
        }: CellProps<AutoinstallFile>) => <div>{lastModified}</div>,
      },
      {
        accessor: "dateCreated",
        className: classes.cell,
        Header: "Date created",
        Cell: ({
          row: {
            original: { dateCreated },
          },
        }: CellProps<AutoinstallFile>) => <div>{dateCreated}</div>,
      },
      {
        accessor: "actions",
        className: classes.actions,
        Header: "Actions",
        Cell: ({ row: { original } }: CellProps<AutoinstallFile>) => (
          <AutoinstallFilesListContextualMenu file={original} />
        ),
      },
    ],
    [files],
  );

  return (
    <ModularTable
      className={classes.table}
      columns={columns}
      data={files}
      getCellProps={getCellProps}
    />
  );
};

export default AutoinstallFilesList;
