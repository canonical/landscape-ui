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
import { Notification } from "@canonical/react-components";
import { lazy, useEffect, type FC } from "react";
import useProfiles from "@/hooks/useProfiles";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import SidePanel from "@/components/layout/SidePanel";
import { ProfileTypes } from "@/features/profiles";

const WslProfileAddSidePanel = lazy(() =>
  import("@/features/wsl-profiles").then((module) => ({
    default: module.WslProfileAddSidePanel,
  })),
);

const WslProfileEditSidePanel = lazy(() =>
  import("@/features/wsl-profiles").then((module) => ({
    default: module.WslProfileEditSidePanel,
  })),
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
  const { sidePath, lastSidePathSegment, createPageParamsSetter } =
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

  useSetDynamicFilterValidation("sidePath", ["add", "edit", "view"]);

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
        <Notification severity="caution" title="WSL profiles is a beta feature">
          We are gathering feedback to improve this feature.{" "}
          <a
            target="_blank"
            rel="noreferrer noopener nofollow"
            href="https://discourse.ubuntu.com/t/feedback-on-the-new-web-portal/50528"
          >
            Share your feedback
          </a>
        </Notification>
        <ProfilesContainer
          type={ProfileTypes.wsl}
          profiles={wslProfiles}
          profilesCount={wslProfilesCount}
          isPending={isGettingWslLimits || isGettingWslProfiles}
        />
      </PageContent>
      <SidePanel
        onClose={createPageParamsSetter({ sidePath: [], name: "" })}
        isOpen={!!sidePath.length}
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
      </SidePanel>
    </PageMain>
  );
};

export default WslProfilesPage;
