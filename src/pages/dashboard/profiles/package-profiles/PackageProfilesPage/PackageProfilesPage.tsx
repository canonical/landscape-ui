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

const PackageProfileConstraintsAddForm = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileConstraintsAddForm,
  })),
);

const PackageProfileConstraintsEditForm = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileConstraintsEditForm,
  })),
);

const PackageProfileDetails = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileDetails,
  })),
);

const PackageProfileDuplicateForm = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileDuplicateForm,
  })),
);

const PackageProfileEditForm = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileEditForm,
  })),
);

const PackageProfilesPage: FC = () => {
  const { sidePath, peekSidePath, setPageParams } = usePageParams();

  useSetDynamicFilterValidation("sidePath", [
    "add",
    "add-constraints",
    "duplicate",
    "edit",
    "edit-constraints",
    "view",
  ]);

  const handleAddPackageProfile = () => {
    setPageParams({ sidePath: ["add"], packageProfile: "" });
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
          setPageParams({ sidePath: [], packageProfile: "" });
        }}
        isOpen={!!sidePath.length}
        size={
          ["add", "add-constraints", "edit-constraints", "view"].includes(
            peekSidePath(),
          )
            ? "medium"
            : undefined
        }
      >
        {peekSidePath() === "add" && (
          <SidePanel.Suspense key="add">
            <PackageProfileAddSidePanel />
          </SidePanel.Suspense>
        )}

        {peekSidePath() === "add-constraints" && (
          <SidePanel.Suspense key="add-constraints">
            <PackageProfileConstraintsAddForm />
          </SidePanel.Suspense>
        )}

        {peekSidePath() === "duplicate" && (
          <SidePanel.Suspense key="duplicate">
            <PackageProfileDuplicateForm />
          </SidePanel.Suspense>
        )}

        {peekSidePath() === "edit" && (
          <SidePanel.Suspense key="edit">
            <PackageProfileEditForm />
          </SidePanel.Suspense>
        )}

        {peekSidePath() === "edit-constraints" && (
          <SidePanel.Suspense key="edit-constraints">
            <PackageProfileConstraintsEditForm />
          </SidePanel.Suspense>
        )}

        {peekSidePath() === "view" && (
          <SidePanel.Suspense key="view">
            <PackageProfileDetails />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default PackageProfilesPage;
