import type { FC } from "react";
import { lazy, Suspense } from "react";
import { Button } from "@canonical/react-ds-global";
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
          type="button"
          importance="primary"
          anticipation="constructive"
          key="table-add-new-mirror"
          onClick={handleScriptCreate}
        >
          Add script
        </Button>,
      ]}
    />
  );
};

export default ScriptsEmptyState;
