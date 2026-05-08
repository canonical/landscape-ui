import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import {
  RepositoryProfileAddButton,
  RepositoryProfileContainer,
  useRepositoryProfiles,
} from "@/features/repository-profiles";
import usePageParams from "@/hooks/usePageParams";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import { lazy, type FC } from "react";

const RepositoryProfileAddSidePanel = lazy(
  async () =>
    import("@/features/repository-profiles/components/RepositoryProfileAddSidePanel"),
);

const RepositoryProfileDetails = lazy(
  async () =>
    import("@/features/repository-profiles/components/RepositoryProfileDetails"),
);

const RepositoryProfileEditForm = lazy(
  async () =>
    import("@/features/repository-profiles/components/RepositoryProfileEditForm"),
);

const RepositoryProfilesPage: FC = () => {
  const { getRepositoryProfilesQuery } = useRepositoryProfiles();
  const { sidePath, lastSidePathSegment, popSidePathUntilClear } =
    usePageParams();

  useSetDynamicFilterValidation("sidePath", [
    "add",
    "add-source",
    "edit",
    "edit-source",
    "view",
  ]);

  const unfilteredRepositoryProfilesResult = getRepositoryProfilesQuery({
    limit: 0,
  });

  if (unfilteredRepositoryProfilesResult.isPending) {
    return <LoadingState />;
  }

  return (
    <PageMain>
      <PageHeader
        title="Repository profiles"
        actions={
          unfilteredRepositoryProfilesResult.data?.data.count
            ? [<RepositoryProfileAddButton key="add" />]
            : undefined
        }
      />
      <PageContent hasTable>
        <RepositoryProfileContainer
          unfilteredRepositoryProfilesResult={
            unfilteredRepositoryProfilesResult
          }
        />
      </PageContent>
      <SidePanel onClose={popSidePathUntilClear} isOpen={!!sidePath.length}>
        {sidePath.includes("add") && (
          <SidePanel.Suspense key="add">
            <RepositoryProfileAddSidePanel />
          </SidePanel.Suspense>
        )}
        {!sidePath.includes("edit") && lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <RepositoryProfileDetails />
          </SidePanel.Suspense>
        )}
        {sidePath.includes("edit") && (
          <SidePanel.Suspense key="edit">
            <RepositoryProfileEditForm />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default RepositoryProfilesPage;
