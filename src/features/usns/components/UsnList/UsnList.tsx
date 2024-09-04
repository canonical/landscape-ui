import classNames from "classnames";
import moment from "moment/moment";
import { FC, useMemo, useRef, useState } from "react";
import { CellProps, Column } from "react-table";
import { useOnClickOutside } from "usehooks-ts";
import {
  Button,
  CheckboxInput,
  ModularTable,
} from "@canonical/react-components";
import ExpandableTable from "@/components/layout/ExpandableTable";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import SelectAllButton from "@/components/layout/SelectAllButton";
import { TablePagination } from "@/components/layout/TablePagination";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { Instance } from "@/types/Instance";
import { Usn } from "@/types/Usn";
import UsnPackagesContainer from "../UsnPackagesContainer";
import {
  getTableRows,
  getUsnsWithExpanded,
  handleCellProps,
  handleRowProps,
} from "./helpers";
import { ExpandedCell } from "./types";
import classes from "./UsnList.module.scss";

type UsnListProps = {
  instances: Instance[];
  isUsnsLoading: boolean;
  onSelectedUsnsChange: (usns: string[]) => void;
  selectedUsns: string[];
  totalUsnCount: number;
  usns: Usn[];
} & (
  | {
      tableType: "paginated";
      search: string;
    }
  | {
      tableType: "expandable";
      onNextPageFetch: () => void;
      onSelectAllClick: () => void;
      showSelectAllButton: boolean;
      totalSelectedUsnCount: number;
    }
);

const UsnList: FC<UsnListProps> = ({
  instances,
  isUsnsLoading,
  onSelectedUsnsChange,
  selectedUsns,
  totalUsnCount,
  usns,
  ...otherProps
}) => {
  const [expandedCell, setExpandedCell] = useState<ExpandedCell>(null);

  const tableRowsRef = useRef<HTMLTableRowElement[]>([]);

  useOnClickOutside(
    {
      current:
        expandedCell?.column === "cves"
          ? tableRowsRef.current[expandedCell.row]
          : null,
    },
    () => setExpandedCell(null),
  );

  const showSelectAllButton =
    otherProps.tableType === "expandable" && otherProps.showSelectAllButton;

  const securityIssues = useMemo<Usn[]>(
    (): Usn[] =>
      getUsnsWithExpanded({
        expandedCell,
        isUsnsLoading,
        showSelectAllButton,
        usns,
      }),
    [usns, expandedCell, isUsnsLoading, showSelectAllButton],
  );

  const handleToggleSingleUsn = (usn: string) => {
    onSelectedUsnsChange(
      selectedUsns.includes(usn)
        ? selectedUsns.filter((selectedUsn) => selectedUsn !== usn)
        : [...selectedUsns, usn],
    );
  };

  const handleExpandCellClick = (columnId: string, rowIndex: number) => {
    setExpandedCell((prevState) => {
      if (prevState?.column === columnId && prevState.row === rowIndex) {
        return null;
      }

      return {
        column: columnId,
        row:
          prevState &&
          ["computers_count", "release_packages"].includes(prevState.column) &&
          prevState.row < rowIndex
            ? rowIndex - 1
            : rowIndex,
      };
    });
  };

  const securityIssueColumns = useMemo<Column<Usn>[]>(
    () =>
      [
        {
          accessor: "checkbox",
          className: "checkbox-column",
          Header: () => (
            <CheckboxInput
              inline
              label={
                <span className="u-off-screen">Toggle all security issues</span>
              }
              disabled={securityIssues.length === 0 || isUsnsLoading}
              indeterminate={
                selectedUsns.length > 0 && selectedUsns.length < usns.length
              }
              checked={
                selectedUsns.length > 0 && selectedUsns.length === usns.length
              }
              onChange={() =>
                onSelectedUsnsChange(
                  selectedUsns.length > 0 ? [] : usns.map(({ usn }) => usn),
                )
              }
            />
          ),
          Cell: ({ row: { original } }: CellProps<Usn>) => (
            <CheckboxInput
              labelClassName="u-no-margin--bottom u-no-padding--top"
              label={
                <span className="u-off-screen">{`Toggle ${original.usn}`}</span>
              }
              disabled={isUsnsLoading}
              name="usn"
              checked={selectedUsns.includes(original.usn)}
              onChange={() => handleToggleSingleUsn(original.usn)}
            />
          ),
        },
        {
          accessor: "usn",
          Header: "USN",
          Cell: ({ row: { index, original } }: CellProps<Usn>) => {
            if (index === 0 && showSelectAllButton) {
              return (
                <SelectAllButton
                  count={otherProps.totalSelectedUsnCount}
                  itemName={{
                    plural: "security issues",
                    singular: "security issue",
                  }}
                  onClick={otherProps.onSelectAllClick}
                  totalCount={totalUsnCount}
                />
              );
            }

            if (
              expandedCell?.row === index - 1 &&
              ["computers_count", "release_packages"].includes(
                expandedCell.column,
              )
            ) {
              return (
                <UsnPackagesContainer
                  isRemovable={
                    expandedCell.column === "release_packages" &&
                    otherProps.tableType === "paginated"
                  }
                  instances={instances}
                  listType={
                    expandedCell.column === "release_packages"
                      ? "packages"
                      : "instances"
                  }
                  usn={securityIssues[expandedCell.row].usn}
                />
              );
            }

            if (isUsnsLoading && index === securityIssues.length - 1) {
              return <LoadingState />;
            }

            return (
              <a
                href={original.usn_link}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                {original.usn}
              </a>
            );
          },
        },
        {
          accessor: "cves",
          Header: "CVE(s)",
          Cell: ({ row: { original, index } }: CellProps<Usn>) => (
            <TruncatedCell
              content={original.cves.map(({ cve, cve_link }) => (
                <span key={cve} className={classes.cve}>
                  <a
                    href={cve_link}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className={classes.cveLink}
                  >
                    {cve}
                  </a>
                </span>
              ))}
              isExpanded={
                expandedCell?.column === "cves" && expandedCell.row === index
              }
              onExpand={() => handleExpandCellClick("cves", index)}
            />
          ),
        },
        {
          accessor: "date",
          Header: "Date published",
          Cell: ({ row }: CellProps<Usn>) => (
            <>
              {moment(row.original.date).isValid() ? (
                moment(row.original.date).format(DISPLAY_DATE_TIME_FORMAT)
              ) : (
                <NoData />
              )}
            </>
          ),
        },
        {
          accessor: "computers_count",
          Header: "Affected instances",
          Cell: ({ column, row: { index, original } }: CellProps<Usn>) => (
            <Button
              type="button"
              className={classNames("p-accordion__tab", classes.expandButton)}
              aria-expanded={
                expandedCell?.column === column.id && expandedCell.row === index
              }
              onClick={() => handleExpandCellClick(column.id, index)}
            >
              {original.computers_count}
            </Button>
          ),
        },
        {
          accessor: "release_packages",
          Header: "Affected packages",
          Cell: ({ column, row: { index } }: CellProps<Usn>) => (
            <Button
              type="button"
              className={classNames("p-accordion__tab", classes.expandButton)}
              aria-expanded={
                expandedCell?.column === column.id && expandedCell.row === index
              }
              onClick={() => handleExpandCellClick(column.id, index)}
            >
              {`${expandedCell?.column === column.id && expandedCell.row === index ? "Hide" : "Show"} packages`}
            </Button>
          ),
        },
      ].filter(({ accessor }) =>
        otherProps.tableType === "paginated"
          ? accessor !== "computers_count"
          : accessor !== "date",
      ),
    [
      securityIssues,
      isUsnsLoading,
      selectedUsns.length,
      otherProps.tableType,
      expandedCell,
    ],
  );

  return (
    <div ref={getTableRows(tableRowsRef)}>
      {otherProps.tableType === "expandable" ? (
        <ExpandableTable
          columns={securityIssueColumns}
          data={securityIssues}
          getCellProps={handleCellProps({
            expandedCell,
            isUsnsLoading,
            lastUsnIndex: securityIssues.length - 1,
            showSelectAllButton,
          })}
          getRowProps={handleRowProps(expandedCell)}
          itemCount={usns.length}
          itemNames={{ plural: "security issues", singular: "security issue" }}
          onLimitChange={otherProps.onNextPageFetch}
          totalCount={totalUsnCount}
        />
      ) : (
        <>
          <ModularTable
            columns={securityIssueColumns}
            data={securityIssues}
            getCellProps={handleCellProps({ expandedCell, isUsnsLoading })}
            getRowProps={handleRowProps(expandedCell)}
            emptyMsg={`No security issues found with the search "${otherProps.search}"`}
          />
          {usns.length > 0 && (
            <TablePagination
              handleClearSelection={() => onSelectedUsnsChange([])}
              totalItems={totalUsnCount}
              currentItemCount={usns.length}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UsnList;
