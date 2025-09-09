import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { TablePagination } from "@/components/layout/TablePagination";
import {
  RepositoryProfileHeader,
  RepositoryProfileList,
  useRepositoryProfiles,
} from "@/features/repository-profiles";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";

const RepositoryProfileForm = lazy(() =>
  import("@/features/repository-profiles").then((module) => ({
    default: module.RepositoryProfileForm,
  })),
);

const RepositoryProfilesPage: FC = () => {
  const { currentPage, pageSize, search } = usePageParams();
  const { setSidePanelContent } = useSidePanel();
  const { getRepositoryProfilesQuery } = useRepositoryProfiles();

  const getUnfilteredRepositoryProfilesQueryResult = getRepositoryProfilesQuery(
    { limit: 0 },
  );

  const getFilteredRepositoryProfilesQueryResult = getRepositoryProfilesQuery({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: search ? [search] : undefined,
  });

  if (getUnfilteredRepositoryProfilesQueryResult.isPending) {
    return <LoadingState />;
  }

  if (getUnfilteredRepositoryProfilesQueryResult.error) {
    throw getUnfilteredRepositoryProfilesQueryResult.error;
  }

  if (getFilteredRepositoryProfilesQueryResult.error) {
    throw getFilteredRepositoryProfilesQueryResult.error;
  }

  const handleAddProfile = () => {
    setSidePanelContent(
      "Add repository profile",
      <Suspense fallback={<LoadingState />}>
        <RepositoryProfileForm action="add" />
      </Suspense>,
    );
  };

  const button = (
    <Button
      appearance="positive"
      key="add"
      onClick={handleAddProfile}
      type="button"
    >
      Add repository profile
    </Button>
  );

  return (
    <PageMain>
      <PageHeader
        title="Repository profiles"
        actions={
          getUnfilteredRepositoryProfilesQueryResult.data.data.count
            ? [button]
            : undefined
        }
      />
      <PageContent>
        {!getUnfilteredRepositoryProfilesQueryResult.data.data.count ? (
          <EmptyState
            title="No repository profiles found"
            body={
              <>
                <p>You haven’t added any repository profiles yet.</p>
                <a
                  href="https://ubuntu.com/landscape/docs/manage-repositories-web-portal"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  How to manage repositories in Landscape
                </a>
              </>
            }
            cta={[button]}
          />
        ) : getFilteredRepositoryProfilesQueryResult.isPending ? (
          <LoadingState />
        ) : (
          <>
            <RepositoryProfileHeader />
            <RepositoryProfileList
              repositoryProfiles={
                getFilteredRepositoryProfilesQueryResult.data.data.results
              }
            />
            <TablePagination
              totalItems={
                getFilteredRepositoryProfilesQueryResult.data.data.count
              }
              currentItemCount={
                getFilteredRepositoryProfilesQueryResult.data.data.results
                  .length
              }
            />
          </>
        )}
      </PageContent>
    </PageMain>
  );
};

export default RepositoryProfilesPage;
