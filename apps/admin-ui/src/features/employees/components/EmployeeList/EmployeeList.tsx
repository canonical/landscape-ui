import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import TruncatedCell from "@/components/layout/TruncatedCell";
import useSidePanel from "@/hooks/useSidePanel";
import type { ExpandedCell } from "@/types/ExpandedCell";
import { Button, Icon, Tooltip } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import { useOnClickOutside } from "usehooks-ts";
import { getStatusText } from "../../helpers";
import type { Employee } from "../../types";
import EmployeeListActions from "../EmployeeListActions";
import classes from "./EmployeeList.module.scss";
import { getTableRows, handleCellProps, handleRowProps } from "./helpers";
import ResponsiveTable from "@/components/layout/ResponsiveTable";

const EmployeeDetails = lazy(async () => import("../EmployeeDetails"));

interface EmployeeListProps {
  readonly employees: Employee[];
}

const EmployeeList: FC<EmployeeListProps> = ({ employees }) => {
  const { setSidePanelContent } = useSidePanel();

  const [expandedCell, setExpandedCell] = useState<ExpandedCell>(null);

  const tableRowsRef = useRef<HTMLTableRowElement[]>([]);

  useOnClickOutside(
    expandedCell?.column === "computers" || expandedCell?.column === "groups"
      ? { current: tableRowsRef.current[expandedCell.row] }
      : [],
    (event) => {
      if (
        event.target instanceof Element &&
        !event.target.closest("truncatedItem")
      ) {
        setExpandedCell(null);
      }
    },
  );

  const handleExpandCellClick = (columnId: string, rowIndex: number) => {
    setExpandedCell((prevState) => {
      if (prevState?.column === columnId && prevState.row === rowIndex) {
        return null;
      }
      return {
        column: columnId,
        row:
          prevState &&
          ["computers", "groups"].includes(prevState.column) &&
          prevState.row < rowIndex
            ? rowIndex - 1
            : rowIndex,
      };
    });
  };

  const handleShowEmployeeDetails = (employee: Employee) => {
    setSidePanelContent(
      "Employee details",
      <Suspense fallback={<LoadingState />}>
        <EmployeeDetails employee={employee} />
      </Suspense>,
      "medium",
    );
  };

  const columns = useMemo<Column<Employee>[]>(
    () => [
      {
        accessor: "name",
        Header: "name",
        Cell: ({ row: { original } }: CellProps<Employee>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top"
            onClick={() => {
              handleShowEmployeeDetails(original);
            }}
            aria-label={`Show details of user ${original.name}`}
          >
            {original.name}
          </Button>
        ),
      },
      {
        accessor: "email",
        Header: "email",
      },
      {
        accessor: "groups",
        Header: "employee group",
        Cell: ({ row: { original, index } }: CellProps<Employee>) =>
          original.groups && original.groups.length > 0 ? (
            <TruncatedCell
              content={original.groups.map((group) => (
                <Link
                  to={`/settings/employees?tab=employee-groups&search=${group.name}`}
                  key={group.group_id}
                  className="truncatedItem"
                >
                  {group.name}
                </Link>
              ))}
              isExpanded={
                expandedCell?.column === "groups" && expandedCell.row === index
              }
              onExpand={() => {
                handleExpandCellClick("groups", index);
              }}
            />
          ) : (
            <NoData />
          ),
      },
      {
        accessor: "autoinstall_file",
        Header: () => (
          <>
            <span className={classes.autoinstallFileHeaderTitle}>
              assigned autoinstall file
            </span>
            <Tooltip message="This configuration file is assigned based on the highest-priority group the user belongs to.">
              <Icon name="help" />
            </Tooltip>
          </>
        ),
        Cell: ({ row: { original } }: CellProps<Employee>) =>
          original.autoinstall_file?.filename ? (
            <span>{original.autoinstall_file?.filename}</span>
          ) : (
            <NoData />
          ),
      },
      {
        accessor: "status",
        Header: "status",
        Cell: ({ row: { original } }: CellProps<Employee>) => (
          <span>{getStatusText(original)}</span>
        ),
        getCellIcon: ({
          row: {
            original: { is_active },
          },
        }: CellProps<Employee>) =>
          is_active ? "status-succeeded-small" : "status-failed-small",
      },
      {
        accessor: "computers",
        Header: "associated instances",
        Cell: ({ row: { original, index } }: CellProps<Employee>) =>
          original.computers && original.computers.length > 0 ? (
            <TruncatedCell
              content={original.computers?.map((computer) => (
                <Link
                  key={computer.id}
                  className="truncatedItem"
                  to={`/instances/${computer.id}`}
                >
                  {computer.title}
                </Link>
              ))}
              isExpanded={
                expandedCell?.column === "computers" &&
                expandedCell.row === index
              }
              onExpand={() => {
                handleExpandCellClick("computers", index);
              }}
            />
          ) : (
            <NoData />
          ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original } }: CellProps<Employee>) => (
          <EmployeeListActions employee={original} />
        ),
      },
    ],
    [employees, expandedCell],
  );

  return (
    <div ref={getTableRows(tableRowsRef)}>
      <ResponsiveTable
        columns={columns}
        data={employees}
        getCellProps={handleCellProps(expandedCell)}
        getRowProps={handleRowProps(expandedCell)}
        emptyMsg="No employees found according to your search parameters."
        minWidth={1200}
      />
    </div>
  );
};

export default EmployeeList;
