import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { AddProfileButton, ProfilesContainer } from "@/features/profiles";
import {
  SecurityProfilesNotifications,
  useGetSecurityProfiles,
  useIsSecurityProfilesLimitReached,
} from "@/features/security-profiles";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";

const SecurityProfilesPage: FC = () => {
  const { currentPage, pageSize, search, status, passRateFrom, passRateTo } =
    usePageParams();
  
  const profileLimitReached = useIsSecurityProfilesLimitReached();

  const getStatus = () => {
    if (status === "all") {
      return undefined;
    }
    if (status) {
      return status;
    }
    return "active";
  };

  const {
    securityProfiles,
    securityProfilesCount,
    isSecurityProfilesLoading: isGettingSecurityProfiles
  } = useGetSecurityProfiles({
    search,
    status: getStatus(),
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    pass_rate_from: passRateFrom != 0 ? passRateFrom : undefined,
    pass_rate_to: passRateTo != 100 ? passRateTo : undefined,
  });

  return (
    <PageMain>
      <PageHeader
        title="Security profiles"
        actions={securityProfilesCount ? [
          <AddProfileButton
            key="add-security-profile"
            disabled={profileLimitReached}
            type="security"
          />
        ] : undefined }
      />

      <PageContent hasTable>
        {!isGettingSecurityProfiles && !!securityProfilesCount && (
          <SecurityProfilesNotifications />
        )}
        <ProfilesContainer
          type={"security"}
          profiles={securityProfiles}
          isPending={isGettingSecurityProfiles}
          isProfileLimitReached={profileLimitReached}
          profilesCount={securityProfilesCount}
        />
      </PageContent>
    </PageMain>
  );
};

export default SecurityProfilesPage;
