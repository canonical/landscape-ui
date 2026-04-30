import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  AddProfileButton,
  ProfilesContainer,
  ViewProfileSidePanel,
} from "@/features/profiles";
import {
  SecurityProfilesNotifications,
  useGetSecurityProfiles,
  useIsSecurityProfilesLimitReached,
  useGetPageSecurityProfile,
  ACTIVE_SECURITY_PROFILES_LIMIT,
  useArchiveSecurityProfile,
} from "@/features/security-profiles";
import usePageParams from "@/hooks/usePageParams";
import { lazy, useEffect, type FC } from "react";
import useProfiles from "@/hooks/useProfiles";
import SidePanel from "@/components/layout/SidePanel";
import { useBoolean } from "usehooks-ts";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import { ProfileTypes } from "@/features/profiles";

const SecurityProfileAddSidePanel = lazy(() =>
  import("@/features/security-profiles").then((module) => ({
    default: module.SecurityProfileAddSidePanel,
  })),
);

const SecurityProfileDownloadAuditSidePanel = lazy(() =>
  import("@/features/security-profiles").then((module) => ({
    default: module.SecurityProfileDownloadAuditSidePanel,
  })),
);

const SecurityProfileDuplicateSidePanel = lazy(() =>
  import("@/features/security-profiles").then((module) => ({
    default: module.SecurityProfileDuplicateSidePanel,
  })),
);

const SecurityProfileEditSidePanel = lazy(() =>
  import("@/features/security-profiles").then((module) => ({
    default: module.SecurityProfileEditSidePanel,
  })),
);

const SecurityProfileRunFixSidePanel = lazy(() =>
  import("@/features/security-profiles").then((module) => ({
    default: module.SecurityProfileRunFixSidePanel,
  })),
);

const SecurityProfilesPage: FC = () => {
  const {
    createPageParamsSetter,
    lastSidePathSegment,
    sidePath,
    currentPage,
    pageSize,
    search,
    status,
    passRateFrom,
    passRateTo,
  } = usePageParams();
  const {
    setIsProfileLimitReached,
    setProfileLimit,
    setRemoveProfile,
    setIsRemovingProfile,
  } = useProfiles();
  const {
    value: isRetentionNotificationVisible,
    setTrue: showRetentionNotification,
    setFalse: hideRetentionNotification,
  } = useBoolean(false);

  const { securityProfile } = useGetPageSecurityProfile();

  const { archiveSecurityProfile, isArchivingSecurityProfile } =
    useArchiveSecurityProfile();

  useEffect(() => {
    setRemoveProfile(({ id }) => archiveSecurityProfile({ id }));
    setIsRemovingProfile(isArchivingSecurityProfile);
  }, [
    setRemoveProfile,
    setIsRemovingProfile,
    isArchivingSecurityProfile,
    archiveSecurityProfile,
  ]);

  const isSecurityProfileLimitReached = useIsSecurityProfilesLimitReached();

  useEffect(() => {
    setIsProfileLimitReached(isSecurityProfileLimitReached);
    setProfileLimit(ACTIVE_SECURITY_PROFILES_LIMIT);
  }, [
    setIsProfileLimitReached,
    isSecurityProfileLimitReached,
    setProfileLimit,
  ]);

  useSetDynamicFilterValidation("sidePath", [
    "add",
    "download",
    "duplicate",
    "edit",
    "run",
    "view",
  ]);

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
    isSecurityProfilesLoading: isGettingSecurityProfiles,
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
        actions={
          securityProfilesCount
            ? [<AddProfileButton key="add-security-profile" />]
            : undefined
        }
      />

      <PageContent hasTable>
        {!isGettingSecurityProfiles && !!securityProfilesCount && (
          <SecurityProfilesNotifications
            isRetentionNotificationVisible={isRetentionNotificationVisible}
            hideRetentionNotification={hideRetentionNotification}
          />
        )}
        <ProfilesContainer
          type={ProfileTypes.security}
          profiles={securityProfiles}
          isPending={isGettingSecurityProfiles}
          profilesCount={securityProfilesCount}
        />
      </PageContent>

      <SidePanel
        onClose={createPageParamsSetter({ sidePath: [], name: "" })}
        isOpen={!!sidePath.length}
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <SecurityProfileAddSidePanel
              showRetentionNotification={showRetentionNotification}
            />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "download" && (
          <SidePanel.Suspense key="download">
            <SecurityProfileDownloadAuditSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "duplicate" && (
          <SidePanel.Suspense key="duplicate">
            <SecurityProfileDuplicateSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <SecurityProfileEditSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "run" && (
          <SidePanel.Suspense key="run">
            <SecurityProfileRunFixSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <ViewProfileSidePanel
              type={ProfileTypes.security}
              profile={securityProfile}
            />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default SecurityProfilesPage;
