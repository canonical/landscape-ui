import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { ProfilesProvider } from "@/context/profiles";
import { AddProfileButton, ProfilesContainer } from "@/features/profiles";
import { useUpgradeProfiles } from "@/features/upgrade-profiles";
import type { FC } from "react";
import { lazy } from "react";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import SidePanel from "@/components/layout/SidePanel";
import { ProfileTypes } from "@/features/profiles";

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
  const { data: getUpgradeProfilesResult, isPending } = getUpgradeProfilesQuery();

  const { sidePath, lastSidePathSegment, createPageParamsSetter } =
    usePageParams();

  useSetDynamicFilterValidation("sidePath", ["add", "edit"]);

  return (
    <ProfilesProvider>
      <PageMain>
        <PageHeader
          title="Upgrade profiles"
          actions={getUpgradeProfilesResult?.data.length
            ? [<AddProfileButton type={ProfileTypes.upgrade} key="add-upgrade-profile" />]
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
        onClose={createPageParamsSetter({ sidePath: [], profile: "" })}
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
      </SidePanel>
      </PageMain>
    </ProfilesProvider>
  );
};

export default UpgradeProfilesPage;
