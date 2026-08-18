import type { FC } from "react";
import { lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import EmptyState from "@/components/layout/EmptyState";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import { REMOTE_SCRIPT_EXECUTION_DOCUMENTATION_URL } from "./constants";

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
        href: REMOTE_SCRIPT_EXECUTION_DOCUMENTATION_URL,
        text: "How to use remote script execution in Landscape",
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
