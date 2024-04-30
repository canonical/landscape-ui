import {
  ComponentProps,
  FC,
  lazy,
  MouseEvent as ReactMouseEvent,
  Suspense,
} from "react";
import { Button, Icon, Tooltip } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import useConfirm from "@/hooks/useConfirm";
import { useScripts } from "@/features/scripts/hooks";
import { Script } from "@/features/scripts/types";

const SingleScript = lazy(() => import("@/features/scripts/SingleScript"));
const ScriptRunForm = lazy(() => import("@/features/scripts/ScriptRunForm"));

interface ScriptListActionsProps {
  script: Script;
}

const ScriptListActions: FC<ScriptListActionsProps> = ({ script }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();
  const { closeConfirmModal, confirmModal } = useConfirm();
  const { removeScriptQuery } = useScripts();

  const { mutateAsync: removeScript } = removeScriptQuery;

  const handleScriptRun = (
    event: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
    script: Script,
  ) => {
    event.currentTarget.blur();

    setSidePanelContent(
      `Run "${script.title}" script`,
      <Suspense fallback={<LoadingState />}>
        <ScriptRunForm script={script} />
      </Suspense>,
    );
  };

  const handleScript = (
    event: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
    scriptProps: ComponentProps<typeof SingleScript>,
  ) => {
    if (scriptProps.action === "add") {
      return;
    }

    event.currentTarget.blur();

    const title =
      "copy" === scriptProps.action
        ? `Copy "${scriptProps.script.title}" script`
        : `Edit "${scriptProps.script.title}" script`;

    setSidePanelContent(
      title,
      <Suspense fallback={<LoadingState />}>
        <SingleScript {...scriptProps} />
      </Suspense>,
    );
  };

  const handleScriptRemove = async (script: Script) => {
    try {
      await removeScript({ script_id: script.id });

      notify.success({
        message: `"${script.title}" script removed successfully`,
        title: "Script removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleScriptRemoveDialog = (script: Script) => {
    confirmModal({
      title: "Removing script",
      body: `This will remove "${script.title}" script.`,
      buttons: [
        <Button
          key={`remove-script-${script.title}`}
          appearance="negative"
          onClick={() => handleScriptRemove(script)}
          hasIcon
          aria-label={`Remove ${script.title} script`}
        >
          Remove
        </Button>,
      ],
    });
  };

  return (
    <div className="divided-blocks">
      <div className="divided-blocks__item">
        <Tooltip message="Run script" position="btm-center">
          <Button
            small
            hasIcon
            appearance="base"
            className="u-no-margin--bottom u-no-padding--left"
            aria-label={`Copy ${script.title} script`}
            onClick={(event) => handleScriptRun(event, script)}
          >
            <Icon name="unit-running" className="u-no-margin--left" />
          </Button>
        </Tooltip>
      </div>
      <div className="divided-blocks__item">
        <Tooltip message="Duplicate" position="btm-center">
          <Button
            small
            hasIcon
            appearance="base"
            className="u-no-margin--bottom u-no-padding--left"
            aria-label={`Copy ${script.title} script`}
            onClick={(event) => handleScript(event, { action: "copy", script })}
          >
            <Icon name="canvas" className="u-no-margin--left" />
          </Button>
        </Tooltip>
      </div>
      <div className="divided-blocks__item">
        <Tooltip message="Edit" position="btm-center">
          <Button
            small
            hasIcon
            appearance="base"
            className="u-no-margin--bottom u-no-padding--left"
            aria-label={`Edit ${script.title} script`}
            onClick={(event) => handleScript(event, { action: "edit", script })}
          >
            <Icon name="edit" className="u-no-margin--left" />
          </Button>
        </Tooltip>
      </div>
      <div className="divided-blocks__item">
        <Tooltip message="Remove" position="btm-center">
          <Button
            small
            hasIcon
            appearance="base"
            className="u-no-margin--bottom u-no-padding--left"
            aria-label={`Remove ${script.title} script`}
            onClick={() => handleScriptRemoveDialog(script)}
          >
            <Icon name="delete" className="u-no-margin--left" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ScriptListActions;
