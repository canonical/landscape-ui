import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { AddProfileButton, ProfilesContainer } from "@/features/profiles";
import { useGetRebootProfiles } from "@/features/reboot-profiles";
import type { FC } from "react";

const RebootProfilesPage: FC = () => {
  const {
    rebootProfiles,
    rebootProfilesCount,
    isGettingRebootProfiles
  } = useGetRebootProfiles();

  return (
    <PageMain>
      <PageHeader
        title="Reboot profiles"
        actions={rebootProfilesCount
          ? [<AddProfileButton key="add-reboot-profile" type="reboot" />]
          : undefined
        }
      />
      <PageContent hasTable>
        <ProfilesContainer 
          type="reboot"
          profiles={rebootProfiles}
          isPending={isGettingRebootProfiles}
          profilesCount={rebootProfilesCount}
        />
      </PageContent>
    </PageMain>
  );
};

export default RebootProfilesPage;
