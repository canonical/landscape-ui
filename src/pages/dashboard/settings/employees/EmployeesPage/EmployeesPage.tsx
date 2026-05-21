import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import LoadingState from "@/components/layout/LoadingState";
import { useGetEmployee } from "@/features/employees";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { lazy } from "react";
import EmployeesTabs from "../EmployeesTabs";

const EmployeeDetails = lazy(
  async () => import("@/features/employees/components/EmployeeDetails"),
);

const EmployeesPage: FC = () => {
  const { lastSidePathSegment, name, popSidePathUntilClear } = usePageParams();

  useSetDynamicFilterValidation("sidePath", ["view"]);

  const { employee, isGettingEmployee } = useGetEmployee(
    { id: Number(name) },
    { enabled: !!name && lastSidePathSegment === "view" },
  );

  return (
    <PageMain>
      <PageHeader title="Employees" />
      <PageContent hasTable>
        <EmployeesTabs />
      </PageContent>
      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={lastSidePathSegment === "view" && !!employee}
        size="medium"
      >
        {lastSidePathSegment === "view" && employee && (
          <SidePanel.Suspense key="view">
            <SidePanel.Header>Employee details</SidePanel.Header>
            <SidePanel.Content>
              {isGettingEmployee ? (
                <LoadingState />
              ) : (
                <EmployeeDetails employee={employee} />
              )}
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default EmployeesPage;
