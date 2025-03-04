import { TablePagination } from "@/components/layout/TablePagination";
import {
  EmployeeList,
  EmployeesPanelHeader,
  useGetEmployees,
} from "@/features/employees";
import LoadingState from "@/components/layout/LoadingState";
import { type FC, useMemo } from "react";
import EmptyState from "@/components/layout/EmptyState";
import { EMPLOYEE_LIMIT, EMPTY_STATE } from "./constants";
import { Notification } from "@canonical/react-components";

const EmployeesPanel: FC = () => {
  const { employees, isPending, count } = useGetEmployees({
    with_autoinstall_file: true,
    with_computers: true,
    with_groups: true,
  });

  const memoizedEmployees = useMemo(() => employees, [employees]);

  const isLimitReached = employees && count && count >= EMPLOYEE_LIMIT;

  return (
    <>
      <EmployeesPanelHeader />
      {isLimitReached && (
        <Notification severity="caution">
          <span>
            <strong>Employee limit reached:</strong> You have reached the limit
            of {EMPLOYEE_LIMIT.toLocaleString()} employees. To allow new
            registrations, delete deactivated users.
          </span>
        </Notification>
      )}
      {isPending ? (
        <LoadingState />
      ) : (
        <EmployeeList employees={memoizedEmployees} />
      )}
      {!isPending && employees.length === 0 && (
        <EmptyState title={EMPTY_STATE.title} body={EMPTY_STATE.body} />
      )}
      <TablePagination totalItems={count} currentItemCount={employees.length} />
    </>
  );
};

export default EmployeesPanel;
