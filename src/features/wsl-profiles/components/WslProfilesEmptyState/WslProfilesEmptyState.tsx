import EmptyState from "@/components/layout/EmptyState";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import type { FC } from "react";

const WslProfilesEmptyState: FC = () => {
  const { setPageParams } = usePageParams();

  const handleCreateWslProfile = () => {
    setPageParams({ action: "add" });
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
