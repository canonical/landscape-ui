import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import { useGetLocalRepositories, LocalRepositoriesContainer, AddLocalRepositoryButton } from "@/features/local-repositories";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { lazy } from "react";

const AddLocalRepositorySidePanel = lazy(async () =>
  import("@/features/local-repositories").then((module) => ({
    default: module.AddLocalRepositorySidePanel,
  })),
);

const ViewLocalRepositorySidePanel = lazy(async () =>
  import("@/features/local-repositories").then((module) => ({
    default: module.ViewLocalRepositorySidePanel,
  })),
);

const EditLocalRepositorySidePanel = lazy(async () =>
  import("@/features/local-repositories").then((module) => ({
    default: module.EditLocalRepositorySidePanel,
  })),
);

const EditLocalRepoPackagesSidePanel = lazy(async () =>
  import("@/features/local-repositories").then((module) => ({
    default: module.EditLocalRepoPackagesSidePanel,
  })),
);

const PublishLocalRepositorySidePanel = lazy(async () =>
  import("@/features/local-repositories").then((module) => ({
    default: module.PublishLocalRepositorySidePanel,
  })),
);

const LocalRepositoriesPage: FC = () => {
  const { lastSidePathSegment, sidePath, createPageParamsSetter } = usePageParams();
  const { result, isGettingLocalRepositories } = useGetLocalRepositories();
  const localRepos = result?.locals ?? [];

  useSetDynamicFilterValidation("sidePath", [
    "add",
    "publish",
    "edit",
    "edit-packages",
    "view",
  ]);

  return (
    <PageMain>
      <PageHeader
        title="Local Repositories"
        actions={localRepos.length ? [<AddLocalRepositoryButton key="add-local-repository" />] : undefined}
      />
      <PageContent hasTable>
        <LocalRepositoriesContainer isPending={isGettingLocalRepositories} items={localRepos} />
      </PageContent>

      <SidePanel
        onClose={createPageParamsSetter({ sidePath: [], repository: "" })}
        isOpen={!!sidePath.length}
      >
       {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <AddLocalRepositorySidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <ViewLocalRepositorySidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <EditLocalRepositorySidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit-packages" && (
          <SidePanel.Suspense key="edit-packages">
            <EditLocalRepoPackagesSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "publish" && (
          <SidePanel.Suspense key="publish">
            <PublishLocalRepositorySidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default LocalRepositoriesPage;
