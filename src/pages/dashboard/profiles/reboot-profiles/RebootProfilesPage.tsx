import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { AddProfileButton, ProfilesContainer } from "@/features/profiles";
import { useGetRebootProfiles } from "@/features/reboot-profiles";
import type { FC } from "react";
import SidePanel from "@/components/layout/SidePanel";
import { lazy } from "react";
import { ProfileTypes } from "@/features/profiles";

const RebootProfileAddSidePanel = lazy(async () =>
  import("@/features/reboot-profiles").then((module) => ({
    default: module.RebootProfileAddSidePanel,
  })),
);

const RebootProfileDuplicateSidePanel = lazy(async () =>
  import("@/features/reboot-profiles").then((module) => ({
    default: module.RebootProfileDuplicateSidePanel,
  })),
);

const RebootProfileEditSidePanel = lazy(async () =>
  import("@/features/reboot-profiles").then((module) => ({
    default: module.RebootProfileEditSidePanel,
  })),
);

const RebootProfilesPage: FC = () => {
  const { rebootProfiles, rebootProfilesCount, isGettingRebootProfiles } =
    useGetRebootProfiles();
  const { sidePath, lastSidePathSegment, createPageParamsSetter } =
    usePageParams();

  useSetDynamicFilterValidation("sidePath", ["add", "duplicate", "edit"]);

  return (
    <PageMain>
      <PageHeader
        title="Reboot profiles"
        actions={
          rebootProfilesCount
            ? [
                <AddProfileButton
                  type={ProfileTypes.reboot}
                  key="add-reboot-profile"
                />,
              ]
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
        onClose={createPageParamsSetter({ sidePath: [], profile: "" })}
        key="add"
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
      </SidePanel>
    </PageMain>
  );
};

export default RebootProfilesPage;
