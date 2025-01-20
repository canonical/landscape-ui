/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, lazy, Suspense, useMemo, useRef, useState } from "react";
import {
  Column,
  CellProps,
} from "@canonical/react-components/node_modules/@types/react-table";
import ExpandableTable from "@/components/layout/ExpandableTable";
import { Employee } from "../../types";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { Link } from "react-router-dom";
import { ExpandedCell } from "../EmployeeGroupsList/types";
import { useOnClickOutside } from "usehooks-ts";
import classes from "./EmployeeList.module.scss";
import { getTableRows, handleCellProps, handleRowProps } from "./helpers";
import { Button } from "@canonical/react-components";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import EmployeeListContextualMenu from "../EmployeeListContextualMenu";

const EmployeeDetails = lazy(() => import("../EmployeeDetails"));

interface EmployeeListProps {
  limit: number;
  onLimitChange: () => void;
  employees: Employee[];
}

const EmployeeList: FC<EmployeeListProps> = ({
  limit,
  onLimitChange,
  employees,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const [expandedCell, setExpandedCell] = useState<ExpandedCell>(null);

  const tableRowsRef = useRef<HTMLTableRowElement[]>([]);

  useOnClickOutside(
    expandedCell?.column === "associated_instances" ||
      expandedCell?.column === "user_groups"
      ? { current: tableRowsRef.current[expandedCell.row] }
      : [],
    (event) => {
      if (
        event.target instanceof Element &&
        !event.target.closest(`.${classes.truncatedItem}`)
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
          ["associated_instances", "user_groups"].includes(prevState.column) &&
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

  const employeesSlice = useMemo(
    () => employees.slice(0, limit),
    [limit, employees],
  );

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
            onClick={() => handleShowEmployeeDetails(original)}
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
        accessor: "user_groups",
        Header: "user group",
        Cell: ({ row: { original, index } }: CellProps<Employee>) => (
          // <TruncatedCell
          //   content={original.user_groups.map((group) => (
          //     <span key={group} className={classes.truncatedItem}>
          //       {group}
          //     </span>
          //   ))}
          //   isExpanded={
          //     expandedCell?.column === "user_groups" &&
          //     expandedCell.row === index
          //   }
          //   onExpand={() => handleExpandCellClick("user_groups", index)}
          // />
          <span>placeholder for user group</span>
        ),
      },
      {
        accessor: "autoinstall_file",
        Header: "autoinstall file",
        Cell: ({ row: { original } }: CellProps<Employee>) => (
          <span>AUTOINSTALL FILE</span>
        ),
      },
      {
        accessor: "status",
        Header: "status",
        Cell: ({ row: { original } }: CellProps<Employee>) => (
          <span>{original.is_active ? "active" : "inactive"}</span>
        ),
        getCellIcon: ({
          row: {
            original: { is_active },
          },
        }: CellProps<Employee>) =>
          is_active ? "status-succeeded-small" : "status-failed-small",
      },
      {
        accessor: "associated_instances",
        Header: "associated instances",
        Cell: ({ row: { original, index } }: CellProps<Employee>) => (
          // <TruncatedCell
          //   content={original.associated_instances.map(({ name, id }) => (
          //     <span
          //       key={id}
          //       className={classes.truncatedItem}
          //       onClick={(e) => e.stopPropagation()}
          //     >
          //       <Link className={classes.truncatedItem} to={`/instances/${id}`}>
          //         {name}
          //       </Link>
          //     </span>
          //   ))}
          //   isExpanded={
          //     expandedCell?.column === "associated_instances" &&
          //     expandedCell.row === index
          //   }
          //   onExpand={() =>
          //     handleExpandCellClick("associated_instances", index)
          //   }
          // />
          <span>placeholder for associated instances</span>
        ),
      },
      {
        accessor: "actions",
        className: classes.actions,
        Header: "actions",
        Cell: ({ row: { original } }: CellProps<Employee>) => (
          <EmployeeListContextualMenu employee={original} />
        ),
      },
    ],
    [employeesSlice.length, expandedCell],
  );

  return (
    <div ref={getTableRows(tableRowsRef)}>
      <ExpandableTable
        columns={columns}
        data={employeesSlice}
        itemNames={{ plural: "employees", singular: "employee" }}
        onLimitChange={onLimitChange}
        totalCount={employees.length}
        getCellProps={handleCellProps(expandedCell)}
        getRowProps={handleRowProps(expandedCell)}
      />
    </div>
  );
};

export default EmployeeList;
