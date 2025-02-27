import LoadingState from "@/components/layout/LoadingState";
import type { FC } from "react";
import { useState } from "react";
import EmptyState from "@/components/layout/EmptyState";
import EmployeeList from "../EmployeeList";
import { useEmployees } from "../../api";

interface EmployeeGroupContainerProps {
  readonly employeesGroupId: number;
  // autoInstallFile: string;
}

const EmployeeGroupContainer: FC<EmployeeGroupContainerProps> = ({
  employeesGroupId,
  // autoInstallFile,
}) => {
  const [limit, setLimit] = useState(5);

  const { getEmployeesQuery } = useEmployees();

  const { data: employeesQueryResult, isLoading } = getEmployeesQuery({
    id: employeesGroupId,
  });

  const employees = employeesQueryResult?.data || [];

  return (
    <>
      {isLoading && <LoadingState />}
      {!isLoading && employees.length === 0 && (
        <EmptyState
          title="No employees found"
          body="Employees will appear here once they authenticate using your organization’s OIDC provider. You’ll see details about each user, their status, and associated instances."
        />
      )}
      {!isLoading && employees.length > 0 && (
        <EmployeeList
          employees={employees}
          limit={limit}
          onLimitChange={() => setLimit((prevState) => prevState + 5)}
          key={limit}
        />
      )}
    </>
  );
};

export default EmployeeGroupContainer;
