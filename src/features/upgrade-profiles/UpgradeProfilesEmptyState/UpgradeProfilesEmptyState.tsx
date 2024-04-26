import { FC, lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";

const SingleUpgradeProfileForm = lazy(
  () => import("@/features/upgrade-profiles/SingleUpgradeProfileForm"),
);

const UpgradeProfilesEmptyState: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleCreateUpgradeProfile = () => {
    setSidePanelContent(
      "Add upgrade profile",
      <Suspense fallback={<LoadingState />}>
        <SingleUpgradeProfileForm action="add" />
      </Suspense>,
    );
  };

  return (
    <EmptyState
      body={
        <>
          <p className="u-no-margin--bottom">
            You haven’t added any upgrade profiles yet.
          </p>
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
      icon="change-version"
      title="Upgrade profiles not found"
    />
  );
};

export default UpgradeProfilesEmptyState;
