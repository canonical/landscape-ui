import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  AddProfileButton,
  ProfilesContainer,
  ViewProfileSidePanel,
} from "@/features/profiles";
import {
  useUpgradeProfiles,
  useGetPageUpgradeProfile,
} from "@/features/upgrade-profiles";
import type { FC } from "react";
import { lazy, useEffect } from "react";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import SidePanel from "@/components/layout/SidePanel";
import { ProfileTypes } from "@/features/profiles";
import useProfiles from "@/hooks/useProfiles";

const UpgradeProfileAddSidePanel = lazy(() =>
  import("@/features/upgrade-profiles").then((module) => ({
    default: module.UpgradeProfileAddSidePanel,
  })),
);

const UpgradeProfileEditSidePanel = lazy(() =>
  import("@/features/upgrade-profiles").then((module) => ({
    default: module.UpgradeProfileEditSidePanel,
  })),
);

const UpgradeProfilesPage: FC = () => {
  const { getUpgradeProfilesQuery } = useUpgradeProfiles();
  const { data: getUpgradeProfilesResult, isPending } =
    getUpgradeProfilesQuery();

  const { sidePath, lastSidePathSegment, createPageParamsSetter } =
    usePageParams();

  const { upgradeProfile } = useGetPageUpgradeProfile();

  const { removeUpgradeProfileQuery } = useUpgradeProfiles();
  const { setRemoveProfile, setIsRemovingProfile } = useProfiles();

  useEffect(() => {
    setRemoveProfile(({ name }) =>
      removeUpgradeProfileQuery.mutateAsync({ name }),
    );
    setIsRemovingProfile(removeUpgradeProfileQuery.isPending);
  }, [setRemoveProfile, removeUpgradeProfileQuery, setIsRemovingProfile]);

  useSetDynamicFilterValidation("sidePath", ["add", "edit", "view"]);

  return (
    <PageMain>
      <PageHeader
        title="Upgrade profiles"
        actions={
          getUpgradeProfilesResult?.data.length
            ? [<AddProfileButton key="add-upgrade-profile" />]
            : undefined
        }
      />
      <PageContent hasTable>
        <ProfilesContainer
          type={ProfileTypes.upgrade}
          isPending={isPending}
          profiles={getUpgradeProfilesResult?.data ?? []}
        />
      </PageContent>

      <SidePanel
        onClose={createPageParamsSetter({ sidePath: [], name: "" })}
        isOpen={!!sidePath.length}
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <UpgradeProfileAddSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <UpgradeProfileEditSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <ViewProfileSidePanel
              type={ProfileTypes.upgrade}
              profile={upgradeProfile}
            />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default UpgradeProfilesPage;
