import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { MenuLink } from "@canonical/react-components";
import {
  ConfirmationModal,
  ContextualMenu,
  Icon,
  ICONS,
} from "@canonical/react-components";
import type { ComponentProps, FC, MouseEvent as ReactMouseEvent } from "react";
import { lazy, Suspense, useState } from "react";
import { useScripts } from "../../hooks";
import type { Script } from "../../types";
import classes from "./ScriptListContextualMenu.module.scss";

const SingleScript = lazy(async () => import("../SingleScript"));
const RunScriptForm = lazy(async () => import("../RunScriptForm"));

interface ScriptListContextualMenuProps {
  readonly script: Script;
}

const ScriptListContextualMenu: FC<ScriptListContextualMenuProps> = ({
  script,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();
  const { removeScriptQuery } = useScripts();

  const { mutateAsync: removeScript, isPending: isRemoving } =
    removeScriptQuery;

  const handleScriptRun = (
    event: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
    scriptToRun: Script,
  ): void => {
    setSidePanelContent(
      `Run "${scriptToRun.title}" script`,
      <Suspense fallback={<LoadingState />}>
        <RunScriptForm script={scriptToRun} />
      </Suspense>,
    );
  };

  const handleScript = (
    event: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
    scriptProps: ComponentProps<typeof SingleScript>,
  ): void => {
    if (scriptProps.action === "add") {
      return;
    }

    event.currentTarget.blur();

    const title =
      "copy" === scriptProps.action
        ? `Duplicate "${scriptProps.script.title}" script`
        : `Edit "${scriptProps.script.title}" script`;

    setSidePanelContent(
      title,
      <Suspense fallback={<LoadingState />}>
        <SingleScript {...scriptProps} />
      </Suspense>,
    );
  };

  const handleScriptRemove = async (): Promise<void> => {
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
  const handleOpenModal = (): void => {
    setModalOpen(true);
  };
  const handleCloseModal = (): void => {
    setModalOpen(false);
  };

  const contextualMenuButtons: MenuLink[] = [
    {
      children: (
        <>
          <Icon name="unit-running" />
          <span>Run script</span>
        </>
      ),
      "aria-label": `Run ${script.title} script`,
      hasIcon: true,
      onClick: (event): void => {
        handleScriptRun(event, script);
      },
    },
    {
      children: (
        <>
          <Icon name="canvas" />
          <span>Duplicate</span>
        </>
      ),
      "aria-label": `Copy ${script.title} script`,
      hasIcon: true,
      onClick: (event): void => {
        handleScript(event, { action: "copy", script });
      },
    },
    {
      children: (
        <>
          <Icon name="edit" />
          <span>Edit</span>
        </>
      ),
      "aria-label": `Edit ${script.title} script`,
      hasIcon: true,
      onClick: (event): void => {
        handleScript(event, { action: "edit", script });
      },
    },
    {
      children: (
        <>
          <Icon name={ICONS.delete} />
          <span>Remove</span>
        </>
      ),
      "aria-label": `Remove ${script.title} script`,
      hasIcon: true,
      onClick: handleOpenModal,
    },
  ];
  return (
    <>
      <ContextualMenu
        position="left"
        className={classes.menu}
        toggleClassName={classes.toggleButton}
        toggleAppearance="base"
        toggleLabel={<Icon name="contextual-menu" />}
        toggleProps={{ "aria-label": `${script.title} actions` }}
        links={contextualMenuButtons}
      />

      {modalOpen && (
        <ConfirmationModal
          title="Remove script"
          confirmButtonLabel="Remove"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={isRemoving}
          confirmButtonLoading={isRemoving}
          onConfirm={handleScriptRemove}
          close={handleCloseModal}
        >
          <p>This will remove &quot;{script.title}&quot; script.</p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default ScriptListContextualMenu;
