import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { AddProfileButton, ProfilesContainer } from "@/features/profiles";
import { useRemovalProfiles } from "@/features/removal-profiles";
import type { FC } from "react";

const RemovalProfilesPage: FC = () => {
  const { getRemovalProfilesQuery } = useRemovalProfiles();
  const {
    data: getRemovalProfilesQueryResult,
    isPending: isGettingRemovalProfiles,
  } = getRemovalProfilesQuery();

  return (
    <PageMain>
      <PageHeader
        title="Removal profiles"
        actions={getRemovalProfilesQueryResult?.data.length 
          ? [<AddProfileButton key="add-removal-profile" type={"removal"} />]
          : undefined
        }
      />
      <PageContent hasTable>
        <ProfilesContainer
          type={"removal"}
          profiles={getRemovalProfilesQueryResult?.data ?? []}
          isPending={isGettingRemovalProfiles}
        />
      </PageContent>
    </PageMain>
  );
};

export default RemovalProfilesPage;
