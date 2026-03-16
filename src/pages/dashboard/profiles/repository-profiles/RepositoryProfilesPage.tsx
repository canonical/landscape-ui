import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { ProfilesProvider } from "@/context/profiles";
import { AddProfileButton, ProfilesContainer } from "@/features/profiles";
import { useRepositoryProfiles } from "@/features/repository-profiles";
import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { lazy } from "react";
import { ProfileTypes } from "@/features/profiles";

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

  useSetDynamicFilterValidation("sidePath", ["add", "edit"]);

  return (
    <ProfilesProvider>
      <PageMain>
        <PageHeader
          title="Repository profiles"
          actions={
            getRepositoryProfilesResult?.data.count
              ? [
                  <AddProfileButton
                    type={ProfileTypes.repository}
                    key="add-repository-profile"
                  />,
                ]
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
        </SidePanel>
      </PageMain>
    </ProfilesProvider>
  );
};

export default RepositoryProfilesPage;
