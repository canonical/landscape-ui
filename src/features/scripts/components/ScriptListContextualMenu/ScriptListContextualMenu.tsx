import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import type { MenuLink } from "@canonical/react-components";
import { ContextualMenu, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import { useArchiveScriptModal, useDeleteScriptModal } from "../../hooks";
import type { Script } from "../../types";
import ScriptDetails from "../ScriptDetails";
import classes from "./ScriptListContextualMenu.module.scss";
import TextConfirmationModal from "@/components/form/TextConfirmationModal";

const EditScriptForm = lazy(async () => import("../EditScriptForm"));
const RunScriptForm = lazy(async () => import("../RunScriptForm"));

interface ScriptListContextualMenuProps {
  readonly script: Script;
}

const ScriptListContextualMenu: FC<ScriptListContextualMenuProps> = ({
  script,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);

  const { setSidePanelContent } = useSidePanel();

  const { is_executable, is_redactable, is_editable } = script;

  const handleScriptRun = (): void => {
    setSidePanelContent(
      `Run "${script.title}" script`,
      <Suspense fallback={<LoadingState />}>
        <RunScriptForm script={script} />
      </Suspense>,
    );
  };

  const handleViewScriptDetails = () => {
    setSidePanelContent(
      script.title,
      <Suspense fallback={<LoadingState />}>
        <ScriptDetails scriptId={script.id} />
      </Suspense>,
    );
  };

  const handleEditScript = (): void => {
    setSidePanelContent(
      `Edit "${script.title}" script`,
      <Suspense fallback={<LoadingState />}>
        <EditScriptForm script={script} />
      </Suspense>,
    );
  };

  const {
    archiveModalBody,
    archiveModalButtonLabel,
    archiveModalTitle,
    isArchivingScript,
    onConfirmArchive,
  } = useArchiveScriptModal({
    script,
    afterSuccess: () => {
      setArchiveModalOpen(false);
    },
  });

  const {
    deleteModalBody,
    deleteModalButtonLabel,
    deleteModalTitle,
    isRemoving,
    onConfirmDelete,
  } = useDeleteScriptModal({
    script,
    afterSuccess: () => {
      setDeleteModalOpen(false);
    },
  });

  const contextualMenuButtons: MenuLink[] = [
    {
      children: (
        <>
          <Icon name="switcher-environments" />
          <span>View details</span>
        </>
      ),
      "aria-label": `View details for ${script.title} script`,
      hasIcon: true,
      onClick: handleViewScriptDetails,
    },
  ];

  if (script.status === "ACTIVE") {
    contextualMenuButtons.push(
      {
        children: (
          <>
            <Icon name="play" />
            <span>Run script</span>
          </>
        ),
        "aria-label": `Run ${script.title} script`,
        hasIcon: true,
        onClick: (): void => {
          handleScriptRun();
        },
        disabled: !is_executable,
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
        onClick: handleEditScript,
        disabled: !is_editable,
      },
      {
        children: (
          <>
            <span className="p-icon--archive--negative" />
            <span className="u-text--negative">Archive</span>
          </>
        ),
        "aria-label": `Archive ${script.title} script`,
        className: classes.separator,
        hasIcon: true,
        onClick: (): void => {
          setArchiveModalOpen(true);
        },
        disabled: !is_editable,
      },
    );
  }

  if (script.status !== "REDACTED") {
    contextualMenuButtons.push({
      children: (
        <>
          <span className="p-icon--delete--negative" />
          <span className="u-text--negative">Delete</span>
        </>
      ),
      "aria-label": `Delete ${script.title} script`,
      className: script.status === "ARCHIVED" ? classes.separator : undefined,
      hasIcon: true,
      onClick: (): void => {
        setDeleteModalOpen(true);
      },
      disabled: !is_redactable,
    });
  }

  return (
    <>
      <ContextualMenu
        position="right"
        className={classes.menu}
        toggleClassName={classes.toggleButton}
        toggleAppearance="base"
        toggleLabel={<Icon name="contextual-menu" />}
        toggleProps={{ "aria-label": `${script.title} actions` }}
        links={contextualMenuButtons}
      />

      <TextConfirmationModal
        isOpen={deleteModalOpen}
        confirmationText={`delete ${script.title}`}
        title={deleteModalTitle}
        confirmButtonLabel={deleteModalButtonLabel}
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isRemoving}
        confirmButtonLoading={isRemoving}
        onConfirm={onConfirmDelete}
        close={() => {
          setDeleteModalOpen(false);
        }}
      >
        <>{deleteModalBody}</>
      </TextConfirmationModal>

      <TextConfirmationModal
        isOpen={archiveModalOpen}
        confirmationText={`archive ${script.title}`}
        title={archiveModalTitle}
        confirmButtonLabel={archiveModalButtonLabel}
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isArchivingScript}
        confirmButtonLoading={isArchivingScript}
        onConfirm={onConfirmArchive}
        close={() => {
          setArchiveModalOpen(false);
        }}
      >
        <>{archiveModalBody}</>
      </TextConfirmationModal>
    </>
  );
};

export default ScriptListContextualMenu;
