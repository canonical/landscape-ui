import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";

const CreateScriptForm = lazy(async () =>
  import("@/features/scripts").then((module) => ({
    default: module.CreateScriptForm,
  })),
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
      body={
        <>
          <p>
            In order to create a script profile, you need to have added a script
            to your Landscape organization.
          </p>

          <Button
            type="button"
            appearance="positive"
            onClick={addScript}
            className="u-no-margin--bottom"
            hasIcon
          >
            <Icon name="plus" light />
            <span>Add script</span>
          </Button>
        </>
      }
    />
  );
};

export default NoScriptsEmptyState;
