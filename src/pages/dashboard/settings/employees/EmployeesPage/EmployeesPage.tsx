import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import type { FC } from "react";
import EmployeesTabs from "../EmployeesTabs";

const EmployeesPage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="Employees" />
      <PageContent hasTable>
        <EmployeesTabs />
      </PageContent>
    </PageMain>
  );
};

export default EmployeesPage;
