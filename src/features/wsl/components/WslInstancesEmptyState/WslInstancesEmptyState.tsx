import EmptyState from "@/components/layout/EmptyState";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import type { FC } from "react";

const WslInstancesEmptyState: FC = () => {
  const { createSidePathPusher } = usePageParams();

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
          onClick={createSidePathPusher("install-wsl")}
        >
          Create new WSL instance
        </Button>,
      ]}
    />
  );
};

export default WslInstancesEmptyState;
