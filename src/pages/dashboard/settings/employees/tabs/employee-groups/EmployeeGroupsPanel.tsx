import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import {
  EmployeeGroupsHeader,
  EmployeeGroupsList,
  useGetEmployeeGroups,
} from "@/features/employee-groups";
import type { FC } from "react";
import { useState } from "react";
import { EMPTY_STATE } from "./constants";
import { Button, Icon, ICONS } from "@canonical/react-components";
import { employeeGroups as employeeGroupsMock } from "@/tests/mocks/employees";

const EmployeeGroupsPanel: FC = () => {
  const [selectedEmployeeGroups, setSelectedEmployeeGroups] = useState<
    number[]
  >([]);

  const { employeeGroupsResult: employeeGroups, isPending } =
    useGetEmployeeGroups({
      with_autoinstall_file: true,
      with_employee_count: true,
    });

  if (!isPending && employeeGroups.length === 0)
    return (
      <EmptyState
        title={EMPTY_STATE.title}
        body={EMPTY_STATE.body}
        cta={[
          <Button key="import-employee-groups" appearance="positive" hasIcon>
            <Icon name={ICONS.plus} className="is-dark" />
            <span>Import Employee groups</span>
          </Button>,
        ]}
      />
    );

  return (
    <>
      <EmployeeGroupsHeader
        selectedEmployeeGroups={selectedEmployeeGroups}
        setSelectedEmployeeGroups={(groupIds: number[]) =>
          setSelectedEmployeeGroups(groupIds)
        }
        employeeGroups={employeeGroups}
      />
      {isPending && !employeeGroups && <LoadingState />}
      {!isPending && employeeGroups && (
        <EmployeeGroupsList
          employeeGroups={employeeGroupsMock}
          isEmployeeGroupsLoading={false}
          onSelectedEmployeeGroupsChange={(groups: number[]) => {
            setSelectedEmployeeGroups(groups);
          }}
          selectedEmployeeGroups={selectedEmployeeGroups}
        />
      )}
      <TablePagination
        totalItems={employeeGroups.length}
        currentItemCount={employeeGroups.length}
      />
    </>
  );
};

export default EmployeeGroupsPanel;
