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
    default: module.PackageProfileAddSidePanel,
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
            <PackageProfileConstraintsAddSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "duplicate" && (
          <SidePanel.Suspense key="duplicate">
            <PackageProfileDuplicateSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <PackageProfileEditSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit-constraints" && (
          <SidePanel.Suspense key="edit-constraints">
            <PackageProfileConstraintsEditSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <PackageProfileDetailsSidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default PackageProfilesPage;
