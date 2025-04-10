import {
  EmployeeGroupIdentityIssuerListContainer,
  EmployeeGroupsHeader,
  EmployeeGroupsList,
  EmptyStateNoGroups,
  EmptyStateNoIssuers,
  useGetEmployeeGroups,
} from "@/features/employee-groups";
import type { FC } from "react";
import { Suspense, useState } from "react";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { useOidcIssuers } from "@/features/oidc";
import usePageParams from "@/hooks/usePageParams";
import { TablePagination } from "@/components/layout/TablePagination";

const EmployeeGroupsPanel: FC = () => {
  const { search } = usePageParams();
  const [selectedEmployeeGroups, setSelectedEmployeeGroups] = useState<
    number[]
  >([]);

  const { employeeGroups, employeeGroupsCount, isEmployeeGroupsLoading } =
    useGetEmployeeGroups({
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

  if (isLoading && !search) {
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

  return (
    <>
      <EmployeeGroupsHeader
        selectedEmployeeGroups={selectedEmployeeGroups}
        employeeGroups={employeeGroups}
        setSelectedEmployeeGroups={(ids) => {
          setSelectedEmployeeGroups(ids);
        }}
      />
      {isEmployeeGroupsLoading ? (
        <LoadingState />
      ) : (
        <>
          <EmployeeGroupsList
            employeeGroups={employeeGroups}
            isEmployeeGroupsLoading={false}
            onSelectedEmployeeGroupsChange={(groups: number[]) => {
              setSelectedEmployeeGroups(groups);
            }}
            selectedEmployeeGroups={selectedEmployeeGroups}
          />
          <TablePagination
            totalItems={employeeGroupsCount}
            currentItemCount={employeeGroups.length}
          />
        </>
      )}
    </>
  );
};

export default EmployeeGroupsPanel;
