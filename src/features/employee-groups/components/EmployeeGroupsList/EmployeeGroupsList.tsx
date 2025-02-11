/* eslint-disable @typescript-eslint/no-unused-vars */
import LoadingState from "@/components/layout/LoadingState";
import {
  Badge,
  Button,
  CheckboxInput,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import type { CellProps, Column } from "react-table";
import classNames from "classnames";
import type { FC } from "react";
import { useMemo, useRef, useState } from "react";
import type { EmployeeGroup } from "../../types";
import EmployeeGroupContainer from "../EmployeeGroupContainer";
import EmployeeGroupsListContextualMenu from "../EmployeeGroupsListContextualMenu";
import classes from "./EmployeeGroupsList.module.scss";
import {
  getEmployeeGroupsWithExpanded,
  getTableRows,
  handleCellProps,
  handleRowProps,
} from "./helpers";
import type { ExpandedCell } from "./types";
import { isNotUnique } from "../../helpers";

interface EmployeeGroupsListProps {
  readonly isEmployeeGroupsLoading: boolean;
  readonly onSelectedEmployeeGroupsChange: (employeeGroups: number[]) => void;
  readonly selectedEmployeeGroups: number[];
  readonly totalEmployeeGroupsCount: number;
  readonly employeeGroups: EmployeeGroup[];
}

const EmployeeGroupsList: FC<EmployeeGroupsListProps> = ({
  isEmployeeGroupsLoading,
  onSelectedEmployeeGroupsChange,
  selectedEmployeeGroups,
  totalEmployeeGroupsCount,
  employeeGroups,
}) => {
  const [expandedCell, setExpandedCell] = useState<ExpandedCell>(null);

  const tableRowsRef = useRef<HTMLTableRowElement[]>([]);

  const tableEmployeeGroups = useMemo<EmployeeGroup[]>(
    (): EmployeeGroup[] =>
      getEmployeeGroupsWithExpanded({
        expandedCell,
        isEmployeeGroupsLoading,
        employeeGroups,
      }),
    [employeeGroups, expandedCell, isEmployeeGroupsLoading],
  );

  const handleToggleSingleEmployeeGroup = (id: number) => {
    onSelectedEmployeeGroupsChange(
      selectedEmployeeGroups.includes(id)
        ? selectedEmployeeGroups.filter((selectedGroup) => selectedGroup !== id)
        : [...selectedEmployeeGroups, id],
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
          ["id"].includes(prevState.column) &&
          prevState.row < rowIndex
            ? rowIndex - 1
            : rowIndex,
      };
    });
  };

  const employeeGroupsColumns = useMemo<Column<EmployeeGroup>[]>(
    () => [
      {
        accessor: "id",
        className: classNames(classes.expandColumn, classes.row),
        Header: "",
        Cell: ({
          column,
          row: { original, index },
        }: CellProps<EmployeeGroup>) => {
          if (expandedCell?.row === index - 1 && expandedCell.column === "id") {
            return <EmployeeGroupContainer employeesGroupId={original.id} />;
          }

          if (
            isEmployeeGroupsLoading &&
            index === tableEmployeeGroups.length - 1
          ) {
            return <LoadingState />;
          }

          return (
            <Button
              type="button"
              className={classNames("p-accordion__tab", classes.expandButton)}
              aria-expanded={
                expandedCell?.column === column.id && expandedCell.row === index
              }
              onClick={() => handleExpandCellClick(column.id, index)}
            />
          );
        },
      },
      {
        accessor: "employees",
        className: "checkbox-column",
        Header: () => (
          <CheckboxInput
            inline
            label={
              <span className="u-off-screen">Toggle all employee groups</span>
            }
            disabled={
              tableEmployeeGroups.length === 0 || isEmployeeGroupsLoading
            }
            indeterminate={
              selectedEmployeeGroups.length > 0 &&
              selectedEmployeeGroups.length < employeeGroups.length
            }
            checked={
              selectedEmployeeGroups.length > 0 &&
              selectedEmployeeGroups.length === employeeGroups.length
            }
            onChange={() =>
              onSelectedEmployeeGroupsChange(
                selectedEmployeeGroups.length > 0
                  ? []
                  : employeeGroups.map(({ id }) => id),
              )
            }
          />
        ),
        Cell: ({ row: { original } }: CellProps<EmployeeGroup>) => (
          <CheckboxInput
            labelClassName="u-no-margin--bottom u-no-padding--top"
            label={
              <span className="u-off-screen">{`Toggle ${original.name}`}</span>
            }
            disabled={isEmployeeGroupsLoading}
            name="employee-group-checkbox"
            checked={selectedEmployeeGroups.includes(original.id)}
            onChange={() => handleToggleSingleEmployeeGroup(original.id)}
          />
        ),
      },
      {
        accessor: "name",
        Header: "name",
        Cell: ({
          row: {
            original: { name, group_id },
          },
        }: CellProps<EmployeeGroup>) => {
          return (
            <>
              <span
                className={classNames(
                  classes.employeeGroupName,
                  "p-text--small-caps",
                )}
              >
                {name}
                {isNotUnique(employeeGroups, name) && (
                  <Tooltip
                    message={`group id: ${group_id}`} //TODO change
                  >
                    <span>&nbsp;(...{group_id.slice(-3)}) </span>
                  </Tooltip>
                )}
              </span>
              {/* <Badge className={classes.badge} value={employees.length} /> */}
            </>
          );
        },
      },
      {
        accessor: "autoinstall_file",
        Header: "autoinstall file",
        Cell: ({ row: { original } }: CellProps<EmployeeGroup>) => (
          <>{original.autoinstall_file}</>
        ),
      },
      {
        accessor: "priority",
        Header: "priority",
        Cell: ({ row }: CellProps<EmployeeGroup>) => (
          <>{row.original.priority}</>
        ),
      },
      {
        accessor: "actions",
        className: classes.actions,
        Header: "actions",
        Cell: ({ row: { original } }: CellProps<EmployeeGroup>) => (
          <EmployeeGroupsListContextualMenu employeeGroup={original} />
        ),
      },
    ],
    [
      tableEmployeeGroups,
      isEmployeeGroupsLoading,
      selectedEmployeeGroups,
      expandedCell,
    ],
  );

  return (
    <div ref={getTableRows(tableRowsRef)}>
      <ModularTable
        columns={employeeGroupsColumns}
        data={tableEmployeeGroups}
        getCellProps={handleCellProps({
          expandedCell,
          isEmployeeGroupsLoading,
          lastEmployeeGroupIndex: employeeGroups.length,
        })}
        getRowProps={handleRowProps(expandedCell)}
        // emptyMsg={`No security issues found with the search "${otherProps.search}"`}
      />
    </div>
  );
};

export default EmployeeGroupsList;
