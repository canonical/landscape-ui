import { FC, useMemo } from "react";
import {
  CellProps,
  Column,
} from "@canonical/react-components/node_modules/@types/react-table";
import { Button, ModularTable } from "@canonical/react-components";
import { AutoinstallFile } from "../../types";
import useSidePanel from "@/hooks/useSidePanel";
import { getCellProps } from "./helpers";
import { usePageParams } from "@/hooks/usePageParams";
import classes from "./AutoinstallFilesList.module.scss";
import AutoinstallFilesListContextualMenu from "../AutoinstallFilesListContextualMenu";
import ViewAutoinstallFileDetailsPanel from "../ViewAutoinstallFileDetailsPanel";
import AutoinstallFileEmployeeGroupsList from "../AutoinstallFileEmployeeGroupsList";

interface AutoinstallFilesListProps {
  autoinstallFiles: AutoinstallFile[];
}

const AutoinstallFilesList: FC<AutoinstallFilesListProps> = ({
  autoinstallFiles,
}) => {
  const { search } = usePageParams();
  const { setSidePanelContent } = useSidePanel();

  const handleAutoinstallFileDetailsOpen = (profile: AutoinstallFile) => {
    setSidePanelContent(
      profile.name,
      <ViewAutoinstallFileDetailsPanel file={profile} />,
      "large",
    );
  };

  const files = useMemo(() => {
    if (!search) {
      return autoinstallFiles;
    }

    return autoinstallFiles.filter((file) => {
      return file.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [autoinstallFiles, search]);

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
            {original.name}
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
    <ModularTable columns={columns} data={files} getCellProps={getCellProps} />
  );
};

export default AutoinstallFilesList;
