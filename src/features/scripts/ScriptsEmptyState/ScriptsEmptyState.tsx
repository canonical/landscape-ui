import { FC, lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import EmptyState from "@/components/layout/EmptyState";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";

const SingleScript = lazy(() => import("@/features/scripts/SingleScript"));

const ScriptsEmptyState: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleScriptCreate = () => {
    setSidePanelContent(
      "Add script",
      <Suspense fallback={<LoadingState />}>
        <SingleScript action="add" />
      </Suspense>,
    );
  };

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
          key="table-create-new-mirror"
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
