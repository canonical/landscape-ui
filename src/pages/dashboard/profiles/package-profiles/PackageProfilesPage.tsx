import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { usePackageProfiles } from "@/features/package-profiles";
import type { FC } from "react";
import { AddProfileButton, ProfilesContainer } from "@/features/profiles";

const PackageProfilesPage: FC = () => {
  const { getPackageProfilesQuery } = usePackageProfiles();
  
  const {
    data: getPackageProfilesQueryResult,
    isPending: isGettingPackageProfiles,
  } = getPackageProfilesQuery();
  const packageProfiles = getPackageProfilesQueryResult?.data.result ?? [];

  return (
    <PageMain>
      <PageHeader
        title="Package profiles"
        actions={packageProfiles.length 
          ? [<AddProfileButton key="add-package-profile" type={"package"} />]
          : undefined
        }
      />
      <PageContent hasTable>
        <ProfilesContainer
          type={"package"}
          profiles={packageProfiles}
          isPending={isGettingPackageProfiles}
        />
      </PageContent>
    </PageMain>
  );
};

export default PackageProfilesPage;
