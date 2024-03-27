import { FC, lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";

const SingleRemovalProfileForm = lazy(
  () => import("@/features/removal-profiles/SingleRemovalProfileForm"),
);

const RemovalProfilesEmptyState: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleCreateRemovalProfile = () => {
    setSidePanelContent(
      "Create removal profile",
      <Suspense fallback={<LoadingState />}>
        <SingleRemovalProfileForm action="create" />
      </Suspense>,
    );
  };

  return (
    <EmptyState
      body={
        <>
          <p className="u-no-margin--bottom">
            You haven’t added any removal profiles yet.
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
          key="table-create-new-mirror"
          onClick={handleCreateRemovalProfile}
          type="button"
        >
          Create removal profile
        </Button>,
      ]}
      icon="delete"
      title="Removal profiles not found"
    />
  );
};

export default RemovalProfilesEmptyState;
