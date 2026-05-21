import type { FC } from "react";
import { Button } from "@canonical/react-components";
import EmptyState from "@/components/layout/EmptyState";
import usePageParams from "@/hooks/usePageParams";

const ScriptsEmptyState: FC = () => {
  const { createSidePathPusher } = usePageParams();

  const handleScriptCreate = createSidePathPusher("create");

  return (
    <EmptyState
      title="No scripts found"
      icon="connected"
      body={
        <>
          <p className="u-no-margin--bottom">
            You haven’t added any scripts yet.
          </p>
          <a
            href="https://ubuntu.com/landscape/docs/managing-computers"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            How to manage instances in Landscape
          </a>
        </>
      }
      cta={[
        <Button
          appearance="positive"
          key="table-add-new-mirror"
          onClick={handleScriptCreate}
          type="button"
        >
          Add script
        </Button>,
      ]}
    />
  );
};

export default ScriptsEmptyState;
