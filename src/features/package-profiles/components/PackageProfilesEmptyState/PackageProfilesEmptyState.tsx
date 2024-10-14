import { FC, lazy, Suspense } from "react";
import EmptyState from "@/components/layout/EmptyState";
import { Button } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";

const PackageProfileAddForm = lazy(() => import("../PackageProfileCreateForm"));

const PackageProfilesEmptyState: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleCreatePackageProfile = () => {
    setSidePanelContent(
      "Add package profile",
      <Suspense fallback={<LoadingState />}>
        <PackageProfileAddForm />
      </Suspense>,
      "medium",
    );
  };

  return (
    <EmptyState
      body={
        <>
          <p>You haven’t added any package profile yet.</p>
          <a
            href="https://ubuntu.com/landscape/docs/managing-packages"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            How to manage packages in Landscape
          </a>
        </>
      }
      cta={[
        <Button
          type="button"
          key="add"
          appearance="positive"
          onClick={handleCreatePackageProfile}
        >
          Add package profile
        </Button>,
      ]}
      icon="package-profiles"
      title="No package profiles found"
    />
  );
};

export default PackageProfilesEmptyState;
