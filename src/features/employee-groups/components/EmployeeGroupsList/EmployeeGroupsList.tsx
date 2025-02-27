import { CheckboxInput, ModularTable } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { useMemo } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import { getEmployeeGroupLabel } from "../../helpers";
import type { EmployeeGroup } from "../../types";
import AutoinstallFileTableCell from "../AutoinstallFileTableCell";
import EmployeeGroupsListContextualMenu from "../EmployeeGroupsListContextualMenu";
import classes from "./EmployeeGroupsList.module.scss";
import { handleCellProps } from "./helpers";

interface EmployeeGroupsListProps {
  readonly isEmployeeGroupsLoading: boolean;
  readonly onSelectedEmployeeGroupsChange: (employeeGroups: number[]) => void;
  readonly selectedEmployeeGroups: number[];
  readonly employeeGroups: EmployeeGroup[];
}

const EmployeeGroupsList: FC<EmployeeGroupsListProps> = ({
  isEmployeeGroupsLoading,
  onSelectedEmployeeGroupsChange,
  selectedEmployeeGroups,
  employeeGroups,
}) => {
  const tableEmployeeGroups = useMemo<EmployeeGroup[]>(
    (): EmployeeGroup[] => employeeGroups,
    [employeeGroups],
  );

  const handleToggleSingleEmployeeGroup = (id: number) => {
    onSelectedEmployeeGroupsChange(
      selectedEmployeeGroups.includes(id)
        ? selectedEmployeeGroups.filter((selectedGroup) => selectedGroup !== id)
        : [...selectedEmployeeGroups, id],
    );
  };

  const employeeGroupsColumns = useMemo<Column<EmployeeGroup>[]>(
    () => [
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
        Cell: ({ row: { original } }: CellProps<EmployeeGroup>) => {
          const label = getEmployeeGroupLabel(original, employeeGroups, true);
          return (
            <span className={classNames(classes.employeeGroupName)}>
              {label}
            </span>
          );
        },
      },
      {
        accessor: "employee_count",
        Header: "employees",
        Cell: ({ row: { original } }: CellProps<EmployeeGroup>) =>
          original.employee_count ? (
            <Link
              to={`/settings/employees?tab=employees&employeeGroups=${original.name}`}
              className={classes.link}
            >
              {original.employee_count}
            </Link>
          ) : (
            <>0</>
          ),
      },
      {
        accessor: "autoinstall_file.filename",
        Header: "assigned autoinstall file",
        Cell: ({ row: { original } }: CellProps<EmployeeGroup>) => (
          <AutoinstallFileTableCell
            fileName={original.autoinstall_file?.filename}
            isDefault={original.autoinstall_file?.is_default}
            version={original.autoinstall_file?.version}
          />
        ),
      },
      {
        accessor: "priority",
        Header: "priority",
        Cell: ({ row }: CellProps<EmployeeGroup>) => (
          <>{row.original.priority || "N/A"}</>
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
    [tableEmployeeGroups, isEmployeeGroupsLoading, selectedEmployeeGroups],
  );

  return (
    <ModularTable
      columns={employeeGroupsColumns}
      data={tableEmployeeGroups}
      getCellProps={handleCellProps()}
      emptyMsg="No employee groups found according to your search parameters."
    />
  );
};

export default EmployeeGroupsList;
