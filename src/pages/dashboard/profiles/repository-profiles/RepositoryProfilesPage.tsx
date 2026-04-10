import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  AddProfileButton,
  ProfilesContainer,
  ViewProfileSidePanel,
} from "@/features/profiles";
import {
  useRepositoryProfiles,
  useGetPageRepositoryProfile,
} from "@/features/repository-profiles";
import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { lazy, useEffect } from "react";
import { ProfileTypes } from "@/features/profiles";
import useProfiles from "@/hooks/useProfiles";

const RepositoryProfileManageSidePanel = lazy(async () =>
  import("@/features/repository-profiles").then((module) => ({
    default: module.RepositoryProfileManageSidePanel,
  })),
);

const RepositoryProfilesPage: FC = () => {
  const { getRepositoryProfilesQuery } = useRepositoryProfiles();
  const { data: getRepositoryProfilesResult, isPending } =
    getRepositoryProfilesQuery();
  const { sidePath, lastSidePathSegment, createPageParamsSetter } =
    usePageParams();
  const { setIsProfileLimitReached } = useProfiles();

  useEffect(() => {
    setIsProfileLimitReached(false);
  }, [setIsProfileLimitReached]);

  const { repositoryProfile } = useGetPageRepositoryProfile();

  useSetDynamicFilterValidation("sidePath", ["add", "edit", "view"]);

  return (
    <PageMain>
      <PageHeader
        title="Repository profiles"
        actions={
          getRepositoryProfilesResult?.data.count
            ? [<AddProfileButton key="add-repository-profile" />]
            : undefined
        }
      />
      <PageContent hasTable>
        <ProfilesContainer
          type={ProfileTypes.repository}
          isPending={isPending}
          profiles={getRepositoryProfilesResult?.data.results ?? []}
        />
      </PageContent>

      <SidePanel
        onClose={createPageParamsSetter({ sidePath: [], profile: "" })}
        isOpen={!!sidePath.length}
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <RepositoryProfileManageSidePanel action="add" />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <RepositoryProfileManageSidePanel action="edit" />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <ViewProfileSidePanel
              type={ProfileTypes.repository}
              profile={repositoryProfile}
            />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default RepositoryProfilesPage;
