import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { AddProfileButton, ProfilesContainer } from "@/features/profiles";
import { useRemovalProfiles } from "@/features/removal-profiles";
import type { FC } from "react";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { lazy } from "react";
import SidePanel from "@/components/layout/SidePanel";
import { ProfileTypes } from "@/features/profiles";

const RemovalProfileAddSidePanel = lazy(async () =>
  import("@/features/removal-profiles").then((module) => ({
    default: module.RemovalProfileAddSidePanel,
  })),
);

const RemovalProfileEditSidePanel = lazy(async () =>
  import("@/features/removal-profiles").then((module) => ({
    default: module.RemovalProfileEditSidePanel,
  })),
);

const RemovalProfilesPage: FC = () => {
  const { getRemovalProfilesQuery } = useRemovalProfiles();
  const {
    data: getRemovalProfilesQueryResult,
    isPending: isGettingRemovalProfiles,
  } = getRemovalProfilesQuery();

  const { sidePath, lastSidePathSegment, createPageParamsSetter } =
    usePageParams();

  useSetDynamicFilterValidation("sidePath", ["add", "edit"]);

  return (
    <PageMain>
      <PageHeader
        title="Removal profiles"
        actions={
          getRemovalProfilesQueryResult?.data.length
            ? [
                <AddProfileButton
                  type={ProfileTypes.removal}
                  key="add-removal-profile"
                />,
              ]
            : undefined
        }
      />
      <PageContent hasTable>
        <ProfilesContainer
          type={ProfileTypes.removal}
          profiles={getRemovalProfilesQueryResult?.data ?? []}
          isPending={isGettingRemovalProfiles}
        />
      </PageContent>

      <SidePanel
        isOpen={!!sidePath.length}
        onClose={createPageParamsSetter({ sidePath: [], profile: "" })}
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <RemovalProfileAddSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <RemovalProfileEditSidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default RemovalProfilesPage;
