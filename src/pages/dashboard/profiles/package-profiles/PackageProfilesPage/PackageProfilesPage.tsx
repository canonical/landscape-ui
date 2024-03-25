import { FC, lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import PackageProfilesContainer from "@/pages/dashboard/profiles/package-profiles/PackageProfilesContainer";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";

const PackageProfileAddForm = lazy(() =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileAddForm,
  })),
);

const PackageProfilesPage: FC = () => {
  const { setSidePanelContent, changeSidePanelTitleLabel } = useSidePanel();

  const handleAddPackageProfile = () => {
    setSidePanelContent(
      "Add package profile",
      <Suspense fallback={<LoadingState />}>
        <PackageProfileAddForm />
      </Suspense>,
    );
    changeSidePanelTitleLabel("Step 1 of 2");
  };

  return (
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
  );
};

export default PackageProfilesPage;
