import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  AddProfileButton,
  ProfilesContainer,
  ViewProfileSidePanel,
} from "@/features/profiles";
import {
  useRemovalProfiles,
  useGetPageRemovalProfile,
} from "@/features/removal-profiles";
import type { FC } from "react";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { lazy, useEffect } from "react";
import SidePanel from "@/components/layout/SidePanel";
import { ProfileTypes } from "@/features/profiles";
import useProfiles from "@/hooks/useProfiles";

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

  const { removalProfile } = useGetPageRemovalProfile();

  const { removeRemovalProfileQuery } = useRemovalProfiles();
  const { setRemoveProfile, setIsRemovingProfile } = useProfiles();

  useEffect(() => {
    setRemoveProfile(({ name }) =>
      removeRemovalProfileQuery.mutateAsync({ name }),
    );
    setIsRemovingProfile(removeRemovalProfileQuery.isPending);
  }, [setRemoveProfile, setIsRemovingProfile, removeRemovalProfileQuery]);

  useSetDynamicFilterValidation("sidePath", ["add", "edit", "view"]);

  return (
    <PageMain>
      <PageHeader
        title="Removal profiles"
        actions={
          getRemovalProfilesQueryResult?.data.length
            ? [<AddProfileButton key="add-removal-profile" />]
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
        onClose={createPageParamsSetter({ sidePath: [], name: "" })}
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

        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <ViewProfileSidePanel
              type={ProfileTypes.removal}
              profile={removalProfile}
            />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default RemovalProfilesPage;
