import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-ds-global";
import type { FC } from "react";
import { lazy, Suspense } from "react";

const CreateScriptForm = lazy(
  async () => import("@/features/scripts/components/CreateScriptForm"),
);

const NoScriptsEmptyState: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const addScript = () => {
    setSidePanelContent(
      "Add script",
      <Suspense fallback={<LoadingState />}>
        <CreateScriptForm />
      </Suspense>,
    );
  };

  return (
    <EmptyState
      title="You need at least one script to add a profile."
      body="In order to create a script profile, you need to have added a script to your Landscape organization."
      cta={[
        <Button
          type="button"
          importance="primary"
          anticipation="constructive"
          icon="plus"
          onClick={addScript}
          key="add-script-button"
        >
          Add script
        </Button>,
      ]}
    />
  );
};

export default NoScriptsEmptyState;
