import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SecurityProfilesList from "@/features/security-profiles";
import type { FC } from "react";
import SecurityProfilesEmptyState from "../SecurityProfilesEmptyState/SecurityProfilesEmptyState";
import useSecurityProfiles from "../../hooks/useSecurityProfiles";

const SecurityProfilesPage: FC = () => {
  const { isLoading } = useSecurityProfiles();

  const USGProfiles: number[] = [];

  if (isLoading) {
    return <LoadingState />;
  }

  if (!USGProfiles.length) {
    return (
      <PageMain>
        <PageHeader title="Security profiles" />
        <PageContent>
          <SecurityProfilesEmptyState />;
          <SecurityProfilesList />
        </PageContent>
      </PageMain>
    );
  }

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
