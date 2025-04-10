import LoadingState from "@/components/layout/LoadingState";
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
  readonly totalCount: number | undefined;
  readonly isLoading: boolean;
}

const EmployeeGroupsTable: FC<EmployeeGroupsTableProps> = ({
  employeeGroups,
  totalCount,
  isLoading,
}) => {
  const [selectedEmployeeGroups, setSelectedEmployeeGroups] = useState<
    number[]
  >([]);

  return (
    <>
      <EmployeeGroupsHeader
        selectedEmployeeGroups={selectedEmployeeGroups}
        employeeGroups={employeeGroups}
        setSelectedEmployeeGroups={(ids: number[]) =>
          setSelectedEmployeeGroups(ids)
        }
      />
      {isLoading ? (
        <LoadingState />
      ) : (
        <EmployeeGroupsList
          employeeGroups={employeeGroups}
          onSelectedEmployeeGroupsChange={(groups: number[]) => {
            setSelectedEmployeeGroups(groups);
          }}
          selectedEmployeeGroups={selectedEmployeeGroups}
        />
      )}
      <TablePagination
        totalItems={totalCount}
        currentItemCount={employeeGroups.length}
      />
    </>
  );
};

export default EmployeeGroupsTable;
