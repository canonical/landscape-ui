import type { FC } from "react";
import { lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import PackageProfilesContainer from "@/pages/dashboard/profiles/package-profiles/PackageProfilesContainer";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";

const PackageProfileCreateForm = lazy(() =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileCreateForm,
  })),
);

const PackageProfilesPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleAddPackageProfile = () => {
    setSidePanelContent(
      "Add package profile",
      <Suspense fallback={<LoadingState />}>
        <PackageProfileCreateForm />
      </Suspense>,
      "medium",
    );
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
