import { TablePagination } from "@/components/layout/TablePagination";
import type { EmployeeGroup } from "@/features/employee-groups";
import {
  EmployeeGroupsHeader,
  EmployeeGroupsList,
} from "@/features/employee-groups";
import type { FC } from "react";
import { useState } from "react";

interface EmployeeGroupsTableProps {
  readonly employeeGroups: EmployeeGroup[];
}

const EmployeeGroupsTable: FC<EmployeeGroupsTableProps> = ({
  employeeGroups,
}) => {
  const [selectedEmployeeGroups, setSelectedEmployeeGroups] = useState<
    number[]
  >([]);

  return (
    <>
      <EmployeeGroupsHeader
        selectedEmployeeGroups={selectedEmployeeGroups}
        employeeGroups={employeeGroups}
        setSelectedEmployeeGroups={(ids) => setSelectedEmployeeGroups(ids)}
      />
      <EmployeeGroupsList
        employeeGroups={employeeGroups}
        isEmployeeGroupsLoading={false}
        onSelectedEmployeeGroupsChange={(groups: number[]) => {
          setSelectedEmployeeGroups(groups);
        }}
        selectedEmployeeGroups={selectedEmployeeGroups}
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

export default EmployeeGroupsTable;
