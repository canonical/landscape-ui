import LoadingState from "@/components/layout/LoadingState";
import LocalSidePanel, {
  LocalSidePanelBody,
} from "@/components/layout/LocalSidePanel";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import PackageProfilesContainer from "@/pages/dashboard/profiles/package-profiles/PackageProfilesContainer";
import { Button } from "@canonical/react-components";
import { lazy, Suspense, type FC } from "react";

const PackageProfileConstraintsSidePanel = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileConstraintsSidePanel,
  })),
);

const PackageProfileCreateForm = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileCreateForm,
  })),
);

const PackageProfileDetails = lazy(async () =>
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
        <LocalSidePanel close={close} size="medium">
          <Suspense
            fallback={
              <LocalSidePanelBody>
                <LoadingState />
              </LocalSidePanelBody>
            }
            key="add"
          >
            <PackageProfileCreateForm />
          </Suspense>
        </LocalSidePanel>
      )}

      {action === "constraints" && (
        <LocalSidePanel close={close} size="medium">
          <Suspense
            fallback={
              <LocalSidePanelBody>
                <LoadingState />
              </LocalSidePanelBody>
            }
            key="constraints"
          >
            <PackageProfileConstraintsSidePanel />
          </Suspense>
        </LocalSidePanel>
      )}

      {action === "duplicate" && (
        <LocalSidePanel close={close}>
          <Suspense
            fallback={
              <LocalSidePanelBody>
                <LoadingState />
              </LocalSidePanelBody>
            }
            key="duplicate"
          >
            <PackageProfileDuplicateSidePanel />
          </Suspense>
        </LocalSidePanel>
      )}

      {action === "edit" && (
        <LocalSidePanel close={close}>
          <Suspense
            fallback={
              <LocalSidePanelBody>
                <LoadingState />
              </LocalSidePanelBody>
            }
            key="edit"
          >
            <PackageProfileEditSidePanel />
          </Suspense>
        </LocalSidePanel>
      )}

      {action === "view" && (
        <LocalSidePanel close={close} size="medium">
          <Suspense
            fallback={
              <LocalSidePanelBody>
                <LoadingState />
              </LocalSidePanelBody>
            }
            key="view"
          >
            <PackageProfileDetails />
          </Suspense>
        </LocalSidePanel>
      )}
    </PageMain>
  );
};

export default PackageProfilesPage;
