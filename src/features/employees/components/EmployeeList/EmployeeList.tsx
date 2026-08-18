import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import useSidePanel from "@/hooks/useSidePanel";
import { ROUTES } from "@/libs/routes";
import type { ExpandedCell } from "@/types/ExpandedCell";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useMemo } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import { getStatusText } from "../../helpers";
import type { Employee } from "../../types";
import EmployeeListActions from "../EmployeeListActions";
import { handleCellProps, handleRowProps } from "./helpers";

const EmployeeDetails = lazy(async () => import("../EmployeeDetails"));

interface EmployeeListProps {
  readonly employees: Employee[];
}

const EmployeeList: FC<EmployeeListProps> = ({ employees }) => {
  const { setSidePanelContent } = useSidePanel();

  const { expandedRowIndex, expandedColumnId, getTableRowsRef, handleExpand } =
    useExpandableRow<HTMLTableRowElement>();

  const columns = useMemo<Column<Employee>[]>(() => {
    const handleShowEmployeeDetails = (employee: Employee) => {
      setSidePanelContent(
        "Employee details",
        <Suspense fallback={<LoadingState />}>
          <EmployeeDetails employee={employee} />
        </Suspense>,
        "medium",
      );
    };

    return [
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
                  to={ROUTES.instances.details.single(computer.id)}
                >
                  {computer.title}
                </Link>
              ))}
              isExpanded={
                expandedColumnId === "computers" && expandedRowIndex === index
              }
              onExpand={() => {
                handleExpand(index, "computers");
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
    ];
  }, [setSidePanelContent, expandedColumnId, expandedRowIndex, handleExpand]);

  const expandedCell: ExpandedCell =
    expandedRowIndex !== null && expandedColumnId !== null
      ? { row: expandedRowIndex, column: expandedColumnId }
      : null;

  return (
    <ResponsiveTable
      columns={columns}
      ref={getTableRowsRef}
      data={employees}
      getCellProps={handleCellProps(expandedCell)}
      getRowProps={handleRowProps(expandedCell)}
      emptyMsg="No employees found according to your search parameters."
      minWidth={1200}
    />
  );
};

export default EmployeeList;
