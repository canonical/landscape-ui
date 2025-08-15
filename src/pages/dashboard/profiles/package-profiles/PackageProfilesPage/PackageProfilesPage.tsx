import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import PackageProfilesContainer from "@/pages/dashboard/profiles/package-profiles/PackageProfilesContainer";
import { Button } from "@canonical/react-components";
import { lazy, type FC } from "react";

const PackageProfileAddSidePanel = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileCreateForm,
  })),
);

const PackageProfileConstraintsAddSidePanel = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileConstraintsAddSidePanel,
  })),
);

const PackageProfileConstraintsEditSidePanel = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileConstraintsEditSidePanel,
  })),
);

const PackageProfileDetailsSidePanel = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileDetailsSidePanel,
  })),
);

const PackageProfileDuplicateSidePanel = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileDuplicateSidePanel,
  })),
);

const PackageProfileEditSidePanel = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileEditSidePanel,
  })),
);

const PackageProfilesPage: FC = () => {
  const { action, setPageParams } = usePageParams();

  useSetDynamicFilterValidation("action", [
    "add",
    "constraints",
    "constraints/add",
    "duplicate",
    "edit",
    "view",
    "view/duplicate",
    "view/edit",
  ]);

  const handleAddPackageProfile = () => {
    setPageParams({ action: "add", packageProfile: "" });
  };

  const closeSidePanel = () => {
    setPageParams({ action: "", packageProfile: "" });
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

      <SidePanel
        onClose={closeSidePanel}
        isOpen={!!action}
        size={
          action === "add" || action === "constraints" || action === "view"
            ? "medium"
            : undefined
        }
      >
        {action === "add" && (
          <SidePanel.Suspense key="add">
            <PackageProfileAddSidePanel />
          </SidePanel.Suspense>
        )}

        {action === "constraints" && (
          <SidePanel.Suspense key="constraints">
            <PackageProfileConstraintsEditSidePanel />
          </SidePanel.Suspense>
        )}

        {action === "constraints/add" && (
          <SidePanel.Suspense key="constraints/add">
            <PackageProfileConstraintsAddSidePanel />
          </SidePanel.Suspense>
        )}

        {(action === "duplicate" || action === "view/duplicate") && (
          <SidePanel.Suspense key="duplicate">
            <PackageProfileDuplicateSidePanel
              hasBackButton={action === "view/duplicate"}
            />
          </SidePanel.Suspense>
        )}

        {(action === "edit" || action === "view/edit") && (
          <SidePanel.Suspense key="edit">
            <PackageProfileEditSidePanel
              hasBackButton={action === "view/edit"}
            />
          </SidePanel.Suspense>
        )}

        {action === "view" && (
          <SidePanel.Suspense key="view">
            <PackageProfileDetailsSidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default PackageProfilesPage;
