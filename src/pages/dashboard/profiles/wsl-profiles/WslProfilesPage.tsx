import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  AddProfileButton,
  ProfilesContainer,
  ViewProfileSidePanel,
} from "@/features/profiles";
import { useGetWslLimits } from "@/features/wsl";
import {
  useGetPageWslProfile,
  useGetWslProfiles,
  useRemoveWslProfile,
} from "@/features/wsl-profiles";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager/constants";
import { lazy, useEffect, type FC } from "react";
import useProfiles from "@/hooks/useProfiles";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import SidePanel from "@/components/layout/SidePanel";
import { ProfileTypes } from "@/features/profiles";

const WslProfileAddSidePanel = lazy(
  () => import("@/features/wsl-profiles/components/WslProfileAddSidePanel"),
);

const WslProfileEditSidePanel = lazy(
  () => import("@/features/wsl-profiles/components/WslProfileEditSidePanel"),
);

const WslProfileNonCompliantInstancesList = lazy(
  () =>
    import(
      "@/features/wsl-profiles/components/WslProfileNonCompliantInstancesList"
    ),
);

const WslProfilesPage: FC = () => {
  const { wslProfilesCount: allWslProfilesCount } = useGetWslProfiles(
    { limit: 1 },
    { listenToUrlParams: false },
  );

  const { isGettingWslProfiles, wslProfiles, wslProfilesCount } =
    useGetWslProfiles({
      limit: DEFAULT_PAGE_SIZE,
      offset: 0,
    });
  const {
    setIsProfileLimitReached,
    setProfileLimit,
    setRemoveProfile,
    setIsRemovingProfile,
  } = useProfiles();
  const { sidePath, lastSidePathSegment, popSidePathUntilClear, setPageParams } =
    usePageParams();

  const { wslProfile } = useGetPageWslProfile();

  const { removeWslProfile, isRemovingWslProfile } = useRemoveWslProfile();

  useEffect(() => {
    setRemoveProfile(({ name }) => removeWslProfile({ name }));
    setIsRemovingProfile(isRemovingWslProfile);
  }, [
    setRemoveProfile,
    setIsRemovingProfile,
    removeWslProfile,
    isRemovingWslProfile,
  ]);

  useSetDynamicFilterValidation("sidePath", ["add", "edit", "view", "noncompliant"]);

  const { isGettingWslLimits, wslProfileLimit } = useGetWslLimits();
  const isWslProfileLimitReached = allWslProfilesCount >= wslProfileLimit;

  useEffect(() => {
    setIsProfileLimitReached(isWslProfileLimitReached);
    setProfileLimit(wslProfileLimit);
  }, [
    isWslProfileLimitReached,
    setIsProfileLimitReached,
    setProfileLimit,
    wslProfileLimit,
  ]);

  const handleClosePanel = () => {
    setPageParams({ sidePath: [], name: undefined });
  };

  return (
    <PageMain>
      <PageHeader
        title="WSL profiles"
        actions={
          wslProfilesCount
            ? [<AddProfileButton key="add-wsl-profile" />]
            : undefined
        }
      />
      <PageContent hasTable>
        <ProfilesContainer
          type={ProfileTypes.wsl}
          profiles={wslProfiles}
          profilesCount={wslProfilesCount}
          isPending={isGettingWslLimits || isGettingWslProfiles}
        />
      </PageContent>
      <SidePanel 
        onClose={handleClosePanel} 
        isOpen={!!sidePath.length}
        size={lastSidePathSegment === "noncompliant" ? "large" : "small"}
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <WslProfileAddSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <WslProfileEditSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <ViewProfileSidePanel
              type={ProfileTypes.wsl}
              profile={wslProfile}
            />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "noncompliant" && wslProfile && (
          <SidePanel.Suspense key="noncompliant">
            <WslProfileNonCompliantInstancesList wslProfile={wslProfile} />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default WslProfilesPage;
