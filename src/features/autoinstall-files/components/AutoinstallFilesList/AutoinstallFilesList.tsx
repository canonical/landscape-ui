import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Chip, ModularTable } from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { AutoinstallFileWithGroups } from "../../types/AutoinstallFile";
import AutoinstallFileEmployeeGroupsList from "../AutoinstallFileEmployeeGroupsList";
import AutoinstallFilesListContextualMenu from "../AutoinstallFilesListContextualMenu";
import ViewAutoinstallFileDetailsPanel from "../ViewAutoinstallFileDetailsPanel";
import classes from "./AutoinstallFilesList.module.scss";
import { getCellProps } from "./helpers";

interface AutoinstallFilesListProps {
  readonly autoinstallFiles: AutoinstallFileWithGroups[];
}

const AutoinstallFilesList: FC<AutoinstallFilesListProps> = ({
  autoinstallFiles,
}) => {
  const { employeeGroups, search } = usePageParams();
  const { setSidePanelContent } = useSidePanel();

  const handleAutoinstallFileDetailsOpen = (
    file: AutoinstallFileWithGroups,
  ): void => {
    setSidePanelContent(
      `${file.filename}${file.is_default ? " (default)" : ""}`,
      <ViewAutoinstallFileDetailsPanel file={file} />,
      "large",
    );
  };

  const files = useMemo(() => {
    return autoinstallFiles.filter((file) => {
      return (
        file.filename.toLowerCase().includes(search.toLowerCase()) &&
        file.groups.some((group) => {
          return (
            !employeeGroups.length || employeeGroups.includes(group.group_id)
          );
        })
      );
    });
  }, [autoinstallFiles, employeeGroups, search]);

  const columns = useMemo<Column<AutoinstallFileWithGroups>[]>(
    () => [
      {
        accessor: "filename",
        className: classes.cell,
        Header: "Name",
        Cell: ({
          row: { original },
        }: CellProps<AutoinstallFileWithGroups>): ReactNode => (
          <div>
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top u-align-text--left"
              onClick={() => handleAutoinstallFileDetailsOpen(original)}
            >
              {`${original.filename}, v${original.version}`}
            </Button>

            {original.is_default && (
              <Chip value="default" className={classes.chip} />
            )}
          </div>
        ),
      },
      {
        accessor: "groups",
        className: classes.cell,
        Header: "Employee Groups Associated",
        Cell: ({
          row: {
            original: { groups },
          },
        }: CellProps<AutoinstallFileWithGroups>): ReactNode => (
          <AutoinstallFileEmployeeGroupsList
            groupNames={groups.map((group) => group.name)}
          />
        ),
      },
      {
        accessor: "last_modified_at",
        className: classes.largeCell,
        Header: "Last modified",
        Cell: ({
          row: {
            original: { last_modified_at },
          },
        }: CellProps<AutoinstallFileWithGroups>): ReactNode => (
          <div>
            {moment(last_modified_at).format(DISPLAY_DATE_TIME_FORMAT)}, by
            Stephanie Domas
          </div>
        ),
      },
      {
        accessor: "created_at",
        className: classes.cell,
        Header: "Date created",
        Cell: ({
          row: {
            original: { created_at },
          },
        }: CellProps<AutoinstallFileWithGroups>): ReactNode => (
          <div>{moment(created_at).format(DISPLAY_DATE_TIME_FORMAT)}</div>
        ),
      },
      {
        accessor: "actions",
        className: classes.actions,
        Header: "Actions",
        Cell: ({
          row: { original },
        }: CellProps<AutoinstallFileWithGroups>): ReactNode => (
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
