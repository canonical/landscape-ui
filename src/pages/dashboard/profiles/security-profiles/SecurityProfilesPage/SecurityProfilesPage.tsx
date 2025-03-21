import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { SecurityProfilesEmptyState } from "@/features/security-profiles";
import { SecurityProfilesHeader } from "@/features/security-profiles";
import { useGetSecurityProfiles } from "@/features/security-profiles";
import { SecurityProfilesList } from "@/features/security-profiles";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";

const SecurityProfilesPage: FC = () => {
  const { currentPage, pageSize } = usePageParams();

  const { securityProfiles, isSecurityProfilesLoading } =
    useGetSecurityProfiles({
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });

  return (
    <PageMain>
      <PageHeader title="Security profiles" />
      <PageContent>
        {isSecurityProfilesLoading ? (
          <LoadingState />
        ) : securityProfiles.length === 0 ? (
          <SecurityProfilesEmptyState />
        ) : (
          <>
            <SecurityProfilesHeader />
            <SecurityProfilesList securityProfiles={securityProfiles} />
          </>
        )}
      </PageContent>
    </PageMain>
  );
};

export default SecurityProfilesPage;
