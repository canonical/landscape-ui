import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SecurityProfilesList from "@/features/security-profiles";
import type { FC } from "react";

const SecurityProfilesPage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="Security profiles" />
      <PageContent>
        <SecurityProfilesList />
      </PageContent>
    </PageMain>
  );
};

export default SecurityProfilesPage;
