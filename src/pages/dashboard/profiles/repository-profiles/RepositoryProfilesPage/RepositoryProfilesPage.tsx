import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  RepositoryProfileAddButton,
  RepositoryProfileContainer,
  useRepositoryProfiles,
} from "@/features/repository-profiles";
import type { FC } from "react";

const RepositoryProfilesPage: FC = () => {
  const { getRepositoryProfilesQuery } = useRepositoryProfiles();

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
      <PageContent>
        <RepositoryProfileContainer
          unfilteredRepositoryProfilesResult={
            unfilteredRepositoryProfilesResult
          }
        />
      </PageContent>
    </PageMain>
  );
};

export default RepositoryProfilesPage;
