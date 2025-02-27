import {
  EmployeeGroupIdentityIssuerList,
  EmployeeGroupsTable,
  useGetEmployeeGroups,
} from "@/features/employee-groups";
import type { FC } from "react";
import { Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";
import EmptyState from "@/components/layout/EmptyState";
import { Button, Icon, ICONS } from "@canonical/react-components";
import useSidePanel from "@/hooks/useSidePanel";
import { EMPTY_STATE } from "./constants";

const EmployeeGroupsPanel: FC = () => {
  const { employeeGroups, isEmployeeGroupsLoading } = useGetEmployeeGroups({
    with_autoinstall_file: true,
    with_employee_count: true,
  });

  const { setSidePanelContent } = useSidePanel();

  const handleImportEmployeeGroups = () => {
    setSidePanelContent(
      "Choose an identity issuer",
      <Suspense fallback={<LoadingState />}>
        <EmployeeGroupIdentityIssuerList />
      </Suspense>,
    );
  };

  return (
    <>
      {isEmployeeGroupsLoading && <LoadingState />}
      {!isEmployeeGroupsLoading && employeeGroups.length === 0 && (
        <EmptyState
          title={EMPTY_STATE.title}
          body={EMPTY_STATE.body}
          cta={[
            <Button
              key="import-employee-groups"
              appearance="positive"
              className="p-segmented-control__button"
              hasIcon
              onClick={handleImportEmployeeGroups}
            >
              <Icon name={ICONS.plus} light />
              <span>Import employee groups</span>
            </Button>,
          ]}
        />
      )}
      {!isEmployeeGroupsLoading && employeeGroups.length > 0 && (
        <EmployeeGroupsTable employeeGroups={employeeGroups} />
      )}
    </>
  );
};

export default EmployeeGroupsPanel;
