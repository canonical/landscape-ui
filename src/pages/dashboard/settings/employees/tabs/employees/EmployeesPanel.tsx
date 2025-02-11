import { TablePagination } from "@/components/layout/TablePagination";
import {
  EmployeeGroupsHeader,
  EmployeeGroupsList,
  useEmployees,
} from "@/features/employee-groups";
import { employeeGroups } from "@/tests/mocks/employees";
import { numberWithCommas } from "@/utils/output";
import { Notification } from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";

const EmployeesPanel: FC = () => {
  const [selectedEmployeeGroups, setSelectedEmployeeGroups] = useState<
    number[]
  >([]);

  const { getEmployeesConfigurationLimit } = useEmployees();

  const { data: employeesConfigurationLimitResult } =
    getEmployeesConfigurationLimit();

  const limit = employeesConfigurationLimitResult?.data?.limit || 0;

  const isLimitReached = limit !== employeeGroups.length; //TODO change

  return (
    <>
      <EmployeeGroupsHeader
        selectedEmployeeGroups={selectedEmployeeGroups}
        employeeGroups={employeeGroups}
      />
      {isLimitReached && (
        <Notification severity="caution">
          <span>
            You have reached the limit of {numberWithCommas(limit)} employees.
            To allow new registrations, delete deactivated users.
          </span>
        </Notification>
      )}
      <EmployeeGroupsList
        employeeGroups={employeeGroups}
        isEmployeeGroupsLoading={false}
        onSelectedEmployeeGroupsChange={(groups: number[]) => {
          setSelectedEmployeeGroups(groups);
        }}
        selectedEmployeeGroups={selectedEmployeeGroups}
        totalEmployeeGroupsCount={employeeGroups.length}
      />
      {employeeGroups.length > 0 && (
        <TablePagination
          handleClearSelection={() => {
            //test
          }}
          totalItems={employeeGroups.length}
          currentItemCount={employeeGroups.length}
        />
      )}
    </>
  );
};

export default EmployeesPanel;
