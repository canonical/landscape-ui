import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import PackageProfilesContainer from "@/pages/dashboard/profiles/package-profiles/PackageProfilesContainer";
import { Button } from "@canonical/react-components";
import { lazy, type FC } from "react";

const PackageProfileConstraintsSidePanel = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileConstraintsSidePanel,
  })),
);

const PackageProfileAddSidePanel = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileCreateForm,
  })),
);

const PackageProfileDetailsSidePanel = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileDetails,
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
    "duplicate",
    "edit",
    "view",
    "view/duplicate",
    "view/edit",
  ]);

  const handleAddPackageProfile = () => {
    setPageParams({ action: "add", packageProfile: "" });
  };

  const close = () => {
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

      {action === "add" && (
        <SidePanel close={close} key="add" size="medium">
          <PackageProfileAddSidePanel />
        </SidePanel>
      )}

      {action === "constraints" && (
        <SidePanel close={close} key="constraints" size="medium">
          <PackageProfileConstraintsSidePanel />
        </SidePanel>
      )}

      {(action === "duplicate" || action === "view/duplicate") && (
        <SidePanel close={close} key="duplicate">
          <PackageProfileDuplicateSidePanel
            hasBackButton={action === "view/duplicate"}
          />
        </SidePanel>
      )}

      {(action === "edit" || action === "view/edit") && (
        <SidePanel close={close} key="edit">
          <PackageProfileEditSidePanel hasBackButton={action === "view/edit"} />
        </SidePanel>
      )}

      {action === "view" && (
        <SidePanel close={close} key="view" size="medium">
          <PackageProfileDetailsSidePanel />
        </SidePanel>
      )}
    </PageMain>
  );
};

export default PackageProfilesPage;
