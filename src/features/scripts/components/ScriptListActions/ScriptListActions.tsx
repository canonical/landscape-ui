import type { ComponentProps, FC, MouseEvent as ReactMouseEvent } from "react";
import { lazy, Suspense } from "react";
import {
  Button,
  ConfirmationButton,
  Icon,
  ICONS,
  Tooltip,
} from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { useScripts } from "../../hooks";
import type { Script } from "../../types";

const SingleScript = lazy(() => import("../SingleScript"));
const RunScriptForm = lazy(() => import("../RunScriptForm"));

interface ScriptListActionsProps {
  readonly script: Script;
}

const ScriptListActions: FC<ScriptListActionsProps> = ({ script }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();
  const { removeScriptQuery } = useScripts();

  const { mutateAsync: removeScript, isPending: isRemoving } =
    removeScriptQuery;

  const handleScriptRun = (
    event: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
    script: Script,
  ) => {
    event.currentTarget.blur();

    setSidePanelContent(
      `Run "${script.title}" script`,
      <Suspense fallback={<LoadingState />}>
        <RunScriptForm script={script} />
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

  const handleScriptRemove = async () => {
    try {
      await removeScript({ script_id: script.id });

      notify.success({
        message: `"${script.title}" script removed successfully`,
        title: "Script removed",
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <div className="divided-blocks">
      <div className="divided-blocks__item">
        <Tooltip message="Run script" position="btm-center">
          <Button
            type="button"
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
            type="button"
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
            type="button"
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
        <ConfirmationButton
          className="has-icon is-small u-no-margin--bottom u-no-padding--left"
          type="button"
          appearance="base"
          confirmationModalProps={{
            title: "Remove script",
            children: (
              <p>This will remove &quot;{script.title}&quot; script.</p>
            ),
            confirmButtonLabel: "Remove",
            confirmButtonAppearance: "negative",
            confirmButtonDisabled: isRemoving,
            confirmButtonLoading: isRemoving,
            onConfirm: handleScriptRemove,
          }}
        >
          <Tooltip message="Remove" position="btm-center">
            <Icon name={ICONS.delete} className="u-no-margin--left" />
          </Tooltip>
        </ConfirmationButton>
      </div>
    </div>
  );
};

export default ScriptListActions;
