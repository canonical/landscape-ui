import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import ListActions from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import type { ComponentProps, FC } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import { useArchiveScriptModal, useDeleteScriptModal } from "../../hooks";
import type { Script } from "../../types";
import ScriptDetails from "../ScriptDetails";

const EditScriptForm = lazy(async () => import("../EditScriptForm"));
const RunScriptForm = lazy(async () => import("../RunScriptForm"));

interface ScriptListActionsProps {
  readonly script: Script;
}

const ScriptListActions: FC<ScriptListActionsProps> = ({ script }) => {
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
    value: archiveModalOpen,
    setTrue: openArchiveModal,
    setFalse: closeArchiveModal,
  } = useBoolean();

  const {
    value: deleteModalOpen,
    setTrue: openDeleteModal,
    setFalse: closeDeleteModal,
  } = useBoolean();

  const {
    archiveModalBody,
    archiveModalButtonLabel,
    archiveModalTitle,
    isArchivingScript,
    onConfirmArchive,
  } = useArchiveScriptModal({
    script,
    afterSuccess: closeArchiveModal,
  });

  const {
    deleteModalBody,
    deleteModalButtonLabel,
    deleteModalTitle,
    isRemoving,
    onConfirmDelete,
  } = useDeleteScriptModal({
    script,
    afterSuccess: closeDeleteModal,
  });

  const nondestructiveActions: ComponentProps<typeof ListActions>["actions"] = [
    {
      icon: "switcher-environments",
      label: "View details",
      "aria-label": `View details for ${script.title} script`,
      onClick: handleViewScriptDetails,
    },
  ];

  const destructiveActions = [];

  if (script.status === "ACTIVE") {
    nondestructiveActions.push(
      {
        icon: "play",
        label: "Run script",
        "aria-label": `Run ${script.title} script`,
        onClick: handleScriptRun,
        disabled: !is_executable,
      },
      {
        icon: "edit",
        label: "Edit",
        "aria-label": `Edit ${script.title} script`,
        onClick: handleEditScript,
        disabled: !is_editable,
      },
    );

    destructiveActions.push({
      icon: "archive",
      label: "Archive",
      "aria-label": `Archive ${script.title} script`,
      onClick: openArchiveModal,
      disabled: !is_editable,
    });
  }

  if (script.status !== "REDACTED") {
    destructiveActions.push({
      icon: "delete",
      label: "Delete",
      "aria-label": `Delete ${script.title} script`,
      onClick: openDeleteModal,
      disabled: !is_redactable,
    });
  }

  return (
    <>
      <ListActions
        toggleAriaLabel={`${script.title} actions`}
        actions={nondestructiveActions}
        destructiveActions={destructiveActions}
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
        close={closeDeleteModal}
      >
        {deleteModalBody}
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
        close={closeArchiveModal}
      >
        {archiveModalBody}
      </TextConfirmationModal>
    </>
  );
};

export default ScriptListActions;
