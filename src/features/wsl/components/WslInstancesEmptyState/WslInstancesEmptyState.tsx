import { FC, lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";

const WslInstanceInstallForm = lazy(() => import("../WslInstanceInstallForm"));

const WslInstancesEmptyState: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleWslInstanceInstall = () => {
    setSidePanelContent(
      "Install new WSL instance",
      <Suspense fallback={<LoadingState />}>
        <WslInstanceInstallForm />
      </Suspense>,
    );
  };

  return (
    <EmptyState
      title="No WSL Instances found"
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
          <span>Install new WSL instance</span>
        </Button>,
      ]}
    />
  );
};

export default WslInstancesEmptyState;
