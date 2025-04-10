import {
  EmployeeGroupIdentityIssuerListContainer,
  EmployeeGroupsTable,
  EmptyStateNoGroups,
  EmptyStateNoIssuers,
  useGetEmployeeGroups,
} from "@/features/employee-groups";
import type { FC } from "react";
import { Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { useOidcIssuers } from "@/features/oidc";
import usePageParams from "@/hooks/usePageParams";

const EmployeeGroupsPanel: FC = () => {
  const {
    search,
    pageSize,
    currentPage,
    employeeGroups: employeeGroupIds,
    autoinstallFiles: autoinstallFileIds,
  } = usePageParams();

  const { oidcDirectoryIssuers, isOidcIssuersLoading } = useOidcIssuers();
  const { setSidePanelContent } = useSidePanel();
  const { employeeGroups, isEmployeeGroupsLoading, employeeGroupsCount } =
    useGetEmployeeGroups({
      with_autoinstall_file: true,
      with_employee_count: true,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      name: search,
      employee_group_ids:
        employeeGroupIds.length > 0 ? employeeGroupIds : undefined,
      autoinstall_file_ids:
        autoinstallFileIds.length > 0 ? autoinstallFileIds : undefined,
    });

  const handleImportEmployeeGroups = () => {
    setSidePanelContent(
      "Choose an identity issuer",
      <Suspense fallback={<LoadingState />}>
        <EmployeeGroupIdentityIssuerListContainer />
      </Suspense>,
    );
  };

  const isLoading = isEmployeeGroupsLoading || isOidcIssuersLoading;
  const issuersMissing = !isLoading && oidcDirectoryIssuers.length === 0;
  const groupsMissing =
    !isLoading && employeeGroupsCount === 0 && search === "";

  if (issuersMissing) {
    return <EmptyStateNoIssuers />;
  }

  if (groupsMissing) {
    return (
      <EmptyStateNoGroups
        handleImportEmployeeGroups={handleImportEmployeeGroups}
      />
    );
  }

  return (
    <EmployeeGroupsTable
      employeeGroups={employeeGroups}
      totalCount={employeeGroupsCount}
      isLoading={isLoading}
    />
  );
};

export default EmployeeGroupsPanel;
