import type { FC } from "react";
import { Button } from "@canonical/react-components";
import EmptyState from "@/components/layout/EmptyState";
import usePageParams from "@/hooks/usePageParams";

const ProvidersEmptyState: FC = () => {
  const { createSidePathPusher } = usePageParams();

  return (
    <EmptyState
      body={
        <>
          <p className="u-no-margin--bottom">
            You haven’t added any identity providers yet.
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
          onClick={createSidePathPusher("choose")}
          type="button"
        >
          Add identity provider
        </Button>,
      ]}
      icon="profile"
      title="No identity providers"
    />
  );
};

export default ProvidersEmptyState;
