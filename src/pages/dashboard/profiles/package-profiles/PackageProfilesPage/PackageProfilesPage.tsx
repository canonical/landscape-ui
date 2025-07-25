import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import useNavigateWithSearch from "@/hooks/useNavigateWithSearch";
import PackageProfilesContainer from "@/pages/dashboard/profiles/package-profiles/PackageProfilesContainer";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { Outlet } from "react-router";

const PackageProfilesPage: FC = () => {
  const navigateWithSearch = useNavigateWithSearch();

  const handleAddPackageProfile = () => {
    navigateWithSearch("add");
  };

  return (
    <>
      <PageMain>
        <PageHeader
          title="Package profiles"
          actions={[
            <Button
              type="button"
              key="add-package-profile"
              appearance="positive"
              onClick={handleAddPackageProfile}
            >
              Add package profile
            </Button>,
          ]}
        />
        <PageContent>
          <PackageProfilesContainer />
        </PageContent>
      </PageMain>

      <Outlet />
    </>
  );
};

export default PackageProfilesPage;
