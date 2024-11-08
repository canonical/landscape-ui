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
      title="You don't have any WSL profiles yet"
      body={
        <>
          <p>
            WSL profiles allow you to create and apply configurations for
            Windows Subsystem for Linux (WSL) instances, in bulk.
          </p>
          <a
            href="https://ubuntu.com/landscape/docs/manage-wsl-instances-in-landscape"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Learn how to use WSL profiles
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
