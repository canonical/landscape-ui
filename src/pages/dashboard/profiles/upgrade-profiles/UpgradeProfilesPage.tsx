import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { AddProfileButton, ProfilesContainer } from "@/features/profiles";
import { useUpgradeProfiles } from "@/features/upgrade-profiles";
import type { FC } from "react";

const UpgradeProfilesPage: FC = () => {
  const { getUpgradeProfilesQuery } = useUpgradeProfiles();
  const { data: getUpgradeProfilesResult, isPending } = getUpgradeProfilesQuery();

  return (
    <PageMain>
      <PageHeader
        title="Upgrade profiles"
        actions={getUpgradeProfilesResult?.data.length
          ? [<AddProfileButton key="add-upgrade-profile" type="upgrade" />]
          : undefined
        }
      />
      <PageContent hasTable>
        <ProfilesContainer
          type="upgrade"
          isPending={isPending}
          profiles={getUpgradeProfilesResult?.data ?? []}
        />
      </PageContent>
    </PageMain>
  );
};

export default UpgradeProfilesPage;
