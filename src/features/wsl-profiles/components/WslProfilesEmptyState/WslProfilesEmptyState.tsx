import { FC, lazy, Suspense } from "react";
import EmptyState from "@/components/layout/EmptyState";
import { Button } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";

const WslProfileInstallForm = lazy(() => import("../WslProfileInstallForm"));

const WslProfilesEmptyState: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleCreateWslProfile = () => {
    setSidePanelContent(
      "Add WSL profile",
      <Suspense fallback={<LoadingState />}>
        <WslProfileInstallForm action="add" />
      </Suspense>,
    );
  };

  return (
    <EmptyState
      title="No WSL profiles found"
      body={
        <>
          <p>You haven’t added any WSL profiles yet.</p>
          <a
            href="https://ubuntu.com/landscape/docs/manage-wsl-instances-in-landscape"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            How to manage WSL profiles in Landscape
          </a>
        </>
      }
      cta={[
        <Button
          type="button"
          key="add"
          appearance="positive"
          onClick={handleCreateWslProfile}
        >
          Add WSL profile
        </Button>,
      ]}
    />
  );
};

export default WslProfilesEmptyState;
