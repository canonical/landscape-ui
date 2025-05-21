import { CheckboxInput, ModularTable } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import type { EmployeeGroup } from "../../types";
import AutoinstallFileTableCell from "../AutoinstallFileTableCell";
import EmployeeGroupsListContextualMenu from "../EmployeeGroupsListContextualMenu";
import classes from "./EmployeeGroupsList.module.scss";
import { handleCellProps } from "./helpers";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import { ROUTES } from "@/libs/routes";

interface EmployeeGroupsListProps {
  readonly onSelectedEmployeeGroupsChange: (employeeGroups: number[]) => void;
  readonly selectedEmployeeGroups: number[];
  readonly employeeGroups: EmployeeGroup[];
}

const EmployeeGroupsList: FC<EmployeeGroupsListProps> = ({
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

  useSetDynamicFilterValidation(
    "employeeGroups",
    employeeGroups.map(({ id }) => id.toString()),
  );

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
            disabled={tableEmployeeGroups.length === 0}
            indeterminate={
              selectedEmployeeGroups.length > 0 &&
              selectedEmployeeGroups.length < employeeGroups.length
            }
            checked={
              selectedEmployeeGroups.length > 0 &&
              selectedEmployeeGroups.length === employeeGroups.length
            }
            onChange={() => {
              onSelectedEmployeeGroupsChange(
                selectedEmployeeGroups.length > 0
                  ? []
                  : employeeGroups.map(({ id }) => id),
              );
            }}
          />
        ),
        Cell: ({ row: { original } }: CellProps<EmployeeGroup>) => (
          <CheckboxInput
            labelClassName="u-no-margin--bottom u-no-padding--top"
            label={
              <span className="u-off-screen">{`Toggle ${original.name}`}</span>
            }
            name="employee-group-checkbox"
            checked={selectedEmployeeGroups.includes(original.id)}
            onChange={() => {
              handleToggleSingleEmployeeGroup(original.id);
            }}
          />
        ),
      },
      {
        accessor: "name",
        Header: "name",
        Cell: ({ row: { original } }: CellProps<EmployeeGroup>) => (
          <>{original.name}</>
        ),
      },
      {
        accessor: "employee_count",
        Header: "employees",
        Cell: ({ row: { original } }: CellProps<EmployeeGroup>) =>
          original.employee_count ? (
            <Link
              to={ROUTES.settingsEmployees({
                tab: "employees",
                employeeGroups: [original.id.toString()],
              })}
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
    [tableEmployeeGroups, selectedEmployeeGroups],
  );

  return (
    <ModularTable
      columns={employeeGroupsColumns}
      data={tableEmployeeGroups}
      getCellProps={handleCellProps()}
      emptyMsg="No employee groups found"
    />
  );
};

export default EmployeeGroupsList;
