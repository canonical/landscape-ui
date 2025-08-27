import EmptyState from "@/components/layout/EmptyState";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import type { FC } from "react";

const UpgradeProfilesEmptyState: FC = () => {
  const { setPageParams } = usePageParams();

  const handleCreateUpgradeProfile = () => {
    setPageParams({ sidePath: ["add"] });
  };

  return (
    <EmptyState
      body={
        <>
          <p>You haven’t added any upgrade profiles yet.</p>
          <a
            href="https://ubuntu.com/landscape/docs/managing-computers"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            How to manage computers in Landscape
          </a>
        </>
      }
      cta={[
        <Button
          appearance="positive"
          key="table-add-new-mirror"
          onClick={handleCreateUpgradeProfile}
          type="button"
        >
          Add upgrade profile
        </Button>,
      ]}
      title="No upgrade profiles found"
    />
  );
};

export default UpgradeProfilesEmptyState;
