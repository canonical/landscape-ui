import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import {
  AddProfileButton,
  ProfilesContainer,
  ViewProfileSidePanel,
} from "@/features/profiles";
import {
  useGetRebootProfiles,
  useGetPageRebootProfile,
  useRemoveRebootProfile,
} from "@/features/reboot-profiles";
import type { FC } from "react";
import SidePanel from "@/components/layout/SidePanel";
import { lazy, useEffect } from "react";
import { ProfileTypes } from "@/features/profiles";
import useProfiles from "@/hooks/useProfiles";

const RebootProfileAddSidePanel = lazy(
  async () =>
    import("@/features/reboot-profiles/components/RebootProfileAddSidePanel"),
);

const RebootProfileDuplicateSidePanel = lazy(
  async () =>
    import("@/features/reboot-profiles/components/RebootProfileDuplicateSidePanel"),
);

const RebootProfileEditSidePanel = lazy(
  async () =>
    import("@/features/reboot-profiles/components/RebootProfileEditSidePanel"),
);

const RebootProfilesPage: FC = () => {
  const { rebootProfiles, rebootProfilesCount, isGettingRebootProfiles } =
    useGetRebootProfiles();
  const { sidePath, lastSidePathSegment, createPageParamsSetter } =
    usePageParams();

  const { rebootProfile } = useGetPageRebootProfile();

  const { removeRebootProfile, isRemovingRebootProfile } =
    useRemoveRebootProfile();
  const { setRemoveProfile, setIsRemovingProfile } = useProfiles();

  useEffect(() => {
    setRemoveProfile(({ id }) => removeRebootProfile({ id }));
    setIsRemovingProfile(isRemovingRebootProfile);
  }, [
    setRemoveProfile,
    setIsRemovingProfile,
    removeRebootProfile,
    isRemovingRebootProfile,
  ]);

  useSetDynamicFilterValidation("sidePath", [
    "add",
    "duplicate",
    "edit",
    "view",
  ]);

  return (
    <PageMain>
      <PageHeader
        title="Reboot profiles"
        actions={
          rebootProfilesCount
            ? [<AddProfileButton key="add-reboot-profile" />]
            : undefined
        }
      />
      <PageContent hasTable>
        <ProfilesContainer
          type={ProfileTypes.reboot}
          profiles={rebootProfiles}
          isPending={isGettingRebootProfiles}
          profilesCount={rebootProfilesCount}
        />
      </PageContent>

      <SidePanel
        onClose={createPageParamsSetter({ sidePath: [], name: "" })}
        isOpen={!!sidePath.length}
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <RebootProfileAddSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "duplicate" && (
          <SidePanel.Suspense key="duplicate">
            <RebootProfileDuplicateSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <RebootProfileEditSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <ViewProfileSidePanel
              type={ProfileTypes.reboot}
              profile={rebootProfile}
            />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default RebootProfilesPage;
