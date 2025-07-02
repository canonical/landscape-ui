import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import {
  EmployeeList,
  EmployeesPanelHeader,
  useGetEmployees,
} from "@/features/employees";
import usePageParams from "@/hooks/usePageParams";
import { Notification } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import { EMPLOYEE_LIMIT, EMPTY_STATE } from "./constants";

const EmployeesPanel: FC = () => {
  const { status, employeeGroups, autoinstallFiles, search } = usePageParams();

  const { employees, isPending, count } = useGetEmployees();

  const memoizedEmployees = useMemo(() => employees, [employees]);

  const isLimitReached = employees && count && count >= EMPLOYEE_LIMIT;

  if (
    !isPending &&
    count === 0 &&
    employeeGroups.length === 0 &&
    autoinstallFiles.length === 0 &&
    status === "" &&
    search === ""
  ) {
    return <EmptyState title={EMPTY_STATE.title} body={EMPTY_STATE.body} />;
  }

  return (
    <>
      <EmployeesPanelHeader />

      {isLimitReached ? (
        <Notification severity="caution">
          <span>
            <strong>Employee limit reached:</strong> You have reached the limit
            of {EMPLOYEE_LIMIT.toLocaleString()} employees. To allow new
            registrations, delete deactivated users.
          </span>
        </Notification>
      ) : null}

      {isPending ? (
        <LoadingState />
      ) : (
        <EmployeeList employees={memoizedEmployees} />
      )}
      <TablePagination totalItems={count} currentItemCount={employees.length} />
    </>
  );
};

export default EmployeesPanel;
