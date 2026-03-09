import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { AddProfileButton, ProfilesContainer } from "@/features/profiles";
import { useRepositoryProfiles } from "@/features/repository-profiles";
import type { FC } from "react";

const RepositoryProfilesPage: FC = () => {
  const { getRepositoryProfilesQuery } = useRepositoryProfiles();
  const { data: getRepositoryProfilesResult, isPending } = getRepositoryProfilesQuery();

  return (
    <PageMain>
      <PageHeader
        title="Repository profiles"
        actions={getRepositoryProfilesResult?.data.count
          ? [<AddProfileButton key="add-repository-profile" type={"repository"} />]
          : undefined
        }
      />
      <PageContent hasTable>
        <ProfilesContainer
          type="repository"
          isPending={isPending}
          profiles={getRepositoryProfilesResult?.data.results ?? []}
        />
      </PageContent>
    </PageMain>
  );
};

export default RepositoryProfilesPage;
