import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  AddProfileButton,
  ProfilesContainer,
  ViewProfileSidePanel,
} from "@/features/profiles";
import {
  USGProfilesNotifications,
  useGetUsgProfiles,
  useIsUsgProfilesLimitReached,
  useGetPageUsgProfile,
  ACTIVE_USG_PROFILES_LIMIT,
  useArchiveUsgProfile,
} from "@/features/usg-profiles";
import usePageParams from "@/hooks/usePageParams";
import { lazy, useEffect, type FC } from "react";
import useProfiles from "@/hooks/useProfiles";
import SidePanel from "@/components/layout/SidePanel";
import { useBoolean } from "usehooks-ts";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import { ProfileTypes } from "@/features/profiles";

const USGProfileAddSidePanel = lazy(
  () =>
    import("@/features/usg-profiles/components/USGProfileAddSidePanel/USGProfileAddSidePanel"),
);

const USGProfileDownloadAuditSidePanel = lazy(
  () =>
    import("@/features/usg-profiles/components/USGProfileDownloadAuditSidePanel/USGProfileDownloadAuditSidePanel"),
);

const USGProfileDuplicateSidePanel = lazy(
  () =>
    import("@/features/usg-profiles/components/USGProfileDuplicateSidePanel/USGProfileDuplicateSidePanel"),
);

const USGProfileEditSidePanel = lazy(
  () =>
    import("@/features/usg-profiles/components/USGProfileEditSidePanel/USGProfileEditSidePanel"),
);

const USGProfileRunFixSidePanel = lazy(
  () =>
    import("@/features/usg-profiles/components/USGProfileRunFixSidePanel/USGProfileRunFixSidePanel"),
);

const USGProfilesPage: FC = () => {
  const {
    popSidePathUntilClear,
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

  const { usgProfile } = useGetPageUsgProfile();

  const { archiveUsgProfile, isArchivingUsgProfile } = useArchiveUsgProfile();

  useEffect(() => {
    setRemoveProfile(({ id }) => archiveUsgProfile({ id }));
    setIsRemovingProfile(isArchivingUsgProfile);
  }, [
    setRemoveProfile,
    setIsRemovingProfile,
    isArchivingUsgProfile,
    archiveUsgProfile,
  ]);

  const isUsgProfileLimitReached = useIsUsgProfilesLimitReached();

  useEffect(() => {
    setIsProfileLimitReached(isUsgProfileLimitReached);
    setProfileLimit(ACTIVE_USG_PROFILES_LIMIT);
  }, [setIsProfileLimitReached, isUsgProfileLimitReached, setProfileLimit]);

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
    usgProfiles,
    usgProfilesCount,
    isUsgProfilesLoading: isGettingUsgProfiles,
  } = useGetUsgProfiles({
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
        title="USG profiles"
        actions={
          usgProfilesCount
            ? [<AddProfileButton key="add-usg-profile" />]
            : undefined
        }
      />

      <PageContent hasTable>
        {!isGettingUsgProfiles && !!usgProfilesCount && (
          <USGProfilesNotifications
            isRetentionNotificationVisible={isRetentionNotificationVisible}
            hideRetentionNotification={hideRetentionNotification}
          />
        )}
        <ProfilesContainer
          type={ProfileTypes.usg}
          profiles={usgProfiles}
          isPending={isGettingUsgProfiles}
          profilesCount={usgProfilesCount}
        />
      </PageContent>

      <SidePanel onClose={popSidePathUntilClear} isOpen={!!sidePath.length}>
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <USGProfileAddSidePanel
              showRetentionNotification={showRetentionNotification}
            />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "download" && (
          <SidePanel.Suspense key="download">
            <USGProfileDownloadAuditSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "duplicate" && (
          <SidePanel.Suspense key="duplicate">
            <USGProfileDuplicateSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <USGProfileEditSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "run" && (
          <SidePanel.Suspense key="run">
            <USGProfileRunFixSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <ViewProfileSidePanel
              type={ProfileTypes.usg}
              profile={usgProfile}
            />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default USGProfilesPage;
