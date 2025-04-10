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
import { type FC, useMemo } from "react";
import { EMPLOYEE_LIMIT, EMPTY_STATE } from "./constants";
import { getStatus } from "./helpers";

const EmployeesPanel: FC = () => {
  const { status, employeeGroups, autoinstallFiles, search } = usePageParams();

  const { employees, isPending, count } = useGetEmployees({
    with_autoinstall_file: true,
    with_computers: true,
    with_groups: true,
    is_active: getStatus(status),
    employee_group_ids: employeeGroups.length > 0 ? employeeGroups : undefined,
    autoinstall_file_ids:
      autoinstallFiles.length > 0 ? autoinstallFiles : undefined,
    search,
  });

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
