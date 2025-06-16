import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import { Button } from "@canonical/react-components";
import classNames from "classnames";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import { useOpenAutoinstallFileDetails } from "../../hooks";
import type { AutoinstallFile, WithGroups } from "../../types";
import AutoinstallFilesListActions from "../AutoinstallFilesListActions";
import classes from "./AutoinstallFilesList.module.scss";
import { getCellProps, getRowProps } from "./helpers";

interface AutoinstallFilesListProps {
  readonly autoinstallFiles: WithGroups<AutoinstallFile>[];
}

const AutoinstallFilesList: FC<AutoinstallFilesListProps> = ({
  autoinstallFiles,
}) => {
  const { expandedRowIndex, getTableRowsRef, handleExpand } =
    useExpandableRow();
  const openAutoinstallFileDetails = useOpenAutoinstallFileDetails();

  const columns = useMemo<Column<WithGroups<AutoinstallFile>>[]>(
    () => [
      {
        accessor: "filename",
        Header: "Name",
        Cell: ({
          row: { original },
        }: CellProps<WithGroups<AutoinstallFile>>): ReactNode => (
          <div className={classes.container}>
            <Button
              type="button"
              appearance="link"
              className="u-no-margin u-no-padding--top"
              onClick={() => {
                openAutoinstallFileDetails(original);
              }}
            >
              {`${original.filename}, v${original.version}`}
            </Button>

            {original.is_default && (
              <span
                className={classNames(
                  "p-chip is-dense u-no-margin--bottom",
                  classes.chip,
                )}
              >
                <span className="p-chip__value">default</span>
              </span>
            )}
          </div>
        ),
      },
      {
        accessor: "groups",
        Header: "Employee Groups Associated",
        Cell: ({
          row: {
            original: { groups },
            index,
          },
        }: CellProps<WithGroups<AutoinstallFile>>): ReactNode => {
          if (!groups || groups.length === 0) {
            return <NoData />;
          }

          const [firstGroupName, ...lastGroupNames] = groups.map(
            (group) => group.name,
          );

          return (
            <TruncatedCell
              content={
                <>
                  <span>{firstGroupName}</span>

                  {lastGroupNames.map((groupName, key) => {
                    return <span key={key}>, {groupName}</span>;
                  })}
                </>
              }
              isExpanded={index == expandedRowIndex}
              onExpand={() => {
                handleExpand(index);
              }}
              showCount
            />
          );
        },
      },
      {
        accessor: "last_modified_at",
        Header: "Last modified",
        Cell: ({
          row: {
            original: { last_modified_at },
          },
        }: CellProps<WithGroups<AutoinstallFile>>): ReactNode => (
          <div className="font-monospace">
            {moment(last_modified_at).format(DISPLAY_DATE_TIME_FORMAT)}
          </div>
        ),
      },
      {
        accessor: "created_at",
        Header: "Date created",
        Cell: ({
          row: {
            original: { created_at },
          },
        }: CellProps<WithGroups<AutoinstallFile>>): ReactNode => (
          <div className="font-monospace">
            {moment(created_at).format(DISPLAY_DATE_TIME_FORMAT)}
          </div>
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({
          row: { original },
        }: CellProps<WithGroups<AutoinstallFile>>): ReactNode => (
          <AutoinstallFilesListActions autoinstallFile={original} />
        ),
      },
    ],
    [expandedRowIndex],
  );

  return (
    <div ref={getTableRowsRef}>
      <ResponsiveTable
        columns={columns}
        data={autoinstallFiles}
        emptyMsg="No autoinstall files found according to your search parameters."
        getCellProps={getCellProps(expandedRowIndex)}
        getRowProps={getRowProps(expandedRowIndex)}
      />
    </div>
  );
};

export default AutoinstallFilesList;
