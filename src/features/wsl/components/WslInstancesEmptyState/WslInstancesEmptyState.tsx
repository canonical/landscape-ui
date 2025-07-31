import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";

const WslInstanceInstallForm = lazy(() => import("../WslInstanceInstallForm"));

const WslInstancesEmptyState: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleWslInstanceInstall = () => {
    setSidePanelContent(
      "Create new WSL instance",
      <Suspense fallback={<LoadingState />}>
        <WslInstanceInstallForm />
      </Suspense>,
    );
  };

  return (
    <EmptyState
      title="No WSL instances found"
      body={
        <>
          <p>
            This computer does not have any WSL instances installed. You can
            install a new instance by clicking the button below.
          </p>
          <a
            href="https://ubuntu.com/desktop/wsl"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Learn more about Ubuntu WSL
          </a>
        </>
      }
      cta={[
        <Button
          key="install-new-instance-button"
          appearance="positive"
          type="button"
          onClick={handleWslInstanceInstall}
        >
          Create new WSL instance
        </Button>,
      ]}
    />
  );
};

export default WslInstancesEmptyState;
