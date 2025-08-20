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
    default: module.PackageProfileCreateSidePanel,
  })),
);

const PackageProfileConstraintsAddForm = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileConstraintsAddSidePanel,
  })),
);

const PackageProfileConstraintsEditForm = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileConstraintsEditSidePanel,
  })),
);

const PackageProfileDetails = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileDetailsSidePanel,
  })),
);

const PackageProfileDuplicateForm = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileDuplicateSidePanel,
  })),
);

const PackageProfileEditForm = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileEditSidePanel,
  })),
);

const PackageProfilesPage: FC = () => {
  const { sidePath, lastSidePathSegment, setPageParams } = usePageParams();

  useSetDynamicFilterValidation("sidePath", [
    "add",
    "add-constraints",
    "duplicate",
    "edit",
    "edit-constraints",
    "view",
  ]);

  const handleAddPackageProfile = () => {
    setPageParams({ sidePath: ["add"], profile: "" });
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
        onClose={() => {
          setPageParams({ sidePath: [], profile: "" });
        }}
        isOpen={!!sidePath.length}
        size={
          ["add", "add-constraints", "edit-constraints", "view"].includes(
            lastSidePathSegment,
          )
            ? "medium"
            : undefined
        }
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <PackageProfileAddSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "add-constraints" && (
          <SidePanel.Suspense key="add-constraints">
            <PackageProfileConstraintsAddForm />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "duplicate" && (
          <SidePanel.Suspense key="duplicate">
            <PackageProfileDuplicateForm />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <PackageProfileEditForm />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit-constraints" && (
          <SidePanel.Suspense key="edit-constraints">
            <PackageProfileConstraintsEditForm />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <PackageProfileDetails />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default PackageProfilesPage;
