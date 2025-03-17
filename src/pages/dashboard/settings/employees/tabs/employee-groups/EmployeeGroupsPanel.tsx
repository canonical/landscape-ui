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

const EmployeeGroupsPanel: FC = () => {
  const { employeeGroups, isEmployeeGroupsLoading } = useGetEmployeeGroups({
    with_autoinstall_file: true,
    with_employee_count: true,
  });
  const { oidcDirectoryIssuers, isOidcIssuersLoading } = useOidcIssuers();

  const { setSidePanelContent } = useSidePanel();

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
  const groupsMissing = !isLoading && employeeGroups.length === 0;

  if (isLoading) {
    return <LoadingState />;
  }

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

  return <EmployeeGroupsTable employeeGroups={employeeGroups} />;
};

export default EmployeeGroupsPanel;
