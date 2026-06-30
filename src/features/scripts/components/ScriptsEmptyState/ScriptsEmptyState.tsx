import type { FC } from "react";
import { lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import EmptyState from "@/components/layout/EmptyState";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";

const CreateScriptForm = lazy(async () => import("../CreateScriptForm"));

const ScriptsEmptyState: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleScriptCreate = () => {
    setSidePanelContent(
      "Add script",
      <Suspense fallback={<LoadingState />}>
        <CreateScriptForm />
      </Suspense>,
    );
  };

  return (
    <EmptyState
      title="No scripts found"
      icon="connected"
      body="You haven’t added any scripts yet."
      link={{
        href: "https://ubuntu.com/landscape/docs/managing-computers",
        text: "How to manage instances in Landscape",
      }}
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
