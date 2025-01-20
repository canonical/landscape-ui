import { TablePagination } from "@/components/layout/TablePagination";
import {
  EmployeeGroupsHeader,
  EmployeeGroupsList,
} from "@/features/employee-groups";
import { employeeGroups } from "@/tests/mocks/employees";
import type { FC } from "react";
import { useState } from "react";

const EmployeesPanel: FC = () => {
  const [selectedEmployeeGroups, setSelectedEmployeeGroups] = useState<
    number[]
  >([]);

  return (
    <>
      <EmployeeGroupsHeader
        selectedEmployeeGroups={selectedEmployeeGroups}
        employeeGroups={employeeGroups}
      />
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
