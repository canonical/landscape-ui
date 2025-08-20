import EmptyState from "@/components/layout/EmptyState";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import type { FC } from "react";

const RemovalProfilesEmptyState: FC = () => {
  const { setPageParams } = usePageParams();

  const handleCreateRemovalProfile = () => {
    setPageParams({ sidePath: ["add"], profile: "" });
  };

  return (
    <EmptyState
      body={
        <>
          <p>You haven’t added any removal profiles yet.</p>
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
          onClick={handleCreateRemovalProfile}
          type="button"
        >
          Add removal profile
        </Button>,
      ]}
      title="No removal profiles found"
    />
  );
};

export default RemovalProfilesEmptyState;
