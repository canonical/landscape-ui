import type { FC } from "react";
import { lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  RepositoryProfileList,
  useRepositoryProfiles,
} from "@/features/repository-profiles";
import useSidePanel from "@/hooks/useSidePanel";

const RepositoryProfileForm = lazy(() =>
  import("@/features/repository-profiles").then((module) => ({
    default: module.RepositoryProfileForm,
  })),
);

const RepositoryProfilesPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();
  const { getRepositoryProfilesQuery } = useRepositoryProfiles();

  const { data: repositoryProfilesResponse, isLoading } =
    getRepositoryProfilesQuery();

  const repositoryProfiles = repositoryProfilesResponse?.data.results ?? [];

  const handleAddProfile = () => {
    setSidePanelContent(
      "Add repository profile",
      <Suspense fallback={<LoadingState />}>
        <RepositoryProfileForm action="add" />
      </Suspense>,
    );
  };

  return (
    <PageMain>
      <PageHeader
        title="Repository profiles"
        actions={[
          <Button
            key="new-key-button"
            appearance="positive"
            onClick={handleAddProfile}
            type="button"
          >
            Add repository profile
          </Button>,
        ]}
      />
      <PageContent>
        {isLoading && <LoadingState />}
        {!isLoading && repositoryProfiles.length === 0 && (
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
            cta={[
              <Button
                appearance="positive"
                key="table-add-new-profile"
                onClick={handleAddProfile}
                type="button"
              >
                Add repository profile
              </Button>,
            ]}
          />
        )}
        {!isLoading && repositoryProfiles.length > 0 && (
          <RepositoryProfileList repositoryProfiles={repositoryProfiles} />
        )}
      </PageContent>
    </PageMain>
  );
};

export default RepositoryProfilesPage;
