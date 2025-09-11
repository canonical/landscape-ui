import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import TruncatedCell from "@/components/layout/TruncatedCell";
import useSidePanel from "@/hooks/useSidePanel";
import type { ExpandedCell } from "@/types/ExpandedCell";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import { useOnClickOutside } from "usehooks-ts";
import { getStatusText } from "../../helpers";
import type { Employee } from "../../types";
import EmployeeListActions from "../EmployeeListActions";
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
    expandedCell?.column === "computers"
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
      if (
        prevState &&
        prevState.column === columnId &&
        prevState.row === rowIndex
      ) {
        return null;
      }

      return {
        column: columnId,
        row:
          prevState &&
          ["computers"].includes(prevState.column) &&
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
