import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useGetSingleScript } from "@/features/scripts";
import useSidePanel from "@/hooks/useSidePanel";
import { Notification } from "@canonical/react-components";
import { Button } from "@canonical/react-ds-global";
import date from "@/libs/date";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { ActionBar } from "@/components/ui";
import { useArchiveScriptModal, useDeleteScriptModal } from "../../hooks";
import type { ScriptTabId } from "../../types";
import { useBoolean } from "usehooks-ts";

const ScriptDetailsTabs = lazy(async () => import("../ScriptDetailsTabs"));

const EditScriptForm = lazy(async () => import("../EditScriptForm"));
const RunScriptForm = lazy(async () => import("../RunScriptForm"));

interface ScriptDetailsProps {
  readonly scriptId: number;
  readonly initialTabId?: ScriptTabId;
}

const ScriptDetails: FC<ScriptDetailsProps> = ({
  scriptId,
  initialTabId = "info",
}) => {
  const {
    setTrue: openModal,
    setFalse: closeModal,
    value: modalOpen,
  } = useBoolean();

  const {
    value: deleteModalOpen,
    setTrue: openDeleteModal,
    setFalse: closeDeleteModal,
  } = useBoolean();

  const { setSidePanelContent } = useSidePanel();

  const { script } = useGetSingleScript(scriptId);

  const {
    archiveModalBody,
    archiveModalButtonLabel,
    archiveModalTitle,
    isArchivingScript,
    onConfirmArchive,
  } = useArchiveScriptModal({
    script,
    afterSuccess: closeModal,
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

  const viewVersionHistory = (): void => {
    if (!script) {
      return;
    }

    setSidePanelContent(
      script.title,
      <Suspense fallback={<LoadingState />}>
        <ScriptDetails scriptId={script.id} initialTabId="version-history" />
      </Suspense>,
    );
  };

  const handleBackToDetails = (): void => {
    if (!script) {
      return;
    }

    setSidePanelContent(
      script.title,
      <Suspense fallback={<LoadingState />}>
        <ScriptDetails scriptId={script.id} />
      </Suspense>,
    );
  };

  const handleEditScript = (): void => {
    if (!script) {
      return;
    }

    setSidePanelContent(
      `Edit "${script.title}" script`,
      <Suspense fallback={<LoadingState />}>
        <EditScriptForm script={script} onBack={handleBackToDetails} />
      </Suspense>,
    );
  };

  const handleRunScript = (): void => {
    if (!script) {
      return;
    }

    setSidePanelContent(
      `Run "${script.title}" script`,
      <Suspense fallback={<LoadingState />}>
        <RunScriptForm script={script} onBack={handleBackToDetails} />
      </Suspense>,
    );
  };

  if (script?.status === "REDACTED") {
    return (
      <Notification severity="caution" className="u-no-margin">
        <b>Script redacted:</b> The script was redacted by{" "}
        {script.last_edited_by.name} on{" "}
        {date(script.last_edited_at).format(DISPLAY_DATE_TIME_FORMAT)}
      </Notification>
    );
  }

  return (
    <>
      {script?.status === "ARCHIVED" ? (
        <Notification severity="caution">
          <b>Script archived:</b> The script was archived by{" "}
          {script.last_edited_by.name} on{" "}
          {date(script.last_edited_at).format(DISPLAY_DATE_TIME_FORMAT)}
        </Notification>
      ) : null}

      {script?.status === "ACTIVE" && (
        <ActionBar>
          <Button
            type="button"
            importance="secondary"
            icon="edit"
            onClick={handleEditScript}
            disabled={!script?.is_editable}
          >
            Edit
          </Button>

          <Button
            type="button"
            importance="secondary"
            icon="play"
            onClick={handleRunScript}
            disabled={!script?.is_executable}
          >
            Run
          </Button>

          <Button
            type="button"
            importance="secondary"
            icon="archive"
            onClick={openModal}
            aria-label={`Archive ${script?.title}`}
            disabled={!script?.is_editable}
          >
            Archive
          </Button>

          <Button
            type="button"
            importance="secondary"
            icon="delete"
            onClick={openDeleteModal}
            aria-label={`Redact ${script?.title}`}
            disabled={!script?.is_redactable}
          >
            Redact
          </Button>
        </ActionBar>
      )}
      {script ? (
        <Suspense fallback={<LoadingState />}>
          <ScriptDetailsTabs
            script={script}
            viewVersionHistory={viewVersionHistory}
            initialTabId={initialTabId}
          />
        </Suspense>
      ) : (
        <LoadingState />
      )}

      <TextConfirmationModal
        isOpen={modalOpen}
        confirmationText={`archive ${script?.title}`}
        title={archiveModalTitle}
        confirmButtonLabel={archiveModalButtonLabel}
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isArchivingScript}
        confirmButtonLoading={isArchivingScript}
        onConfirm={onConfirmArchive}
        close={closeModal}
        renderInPortal
      >
        <>{archiveModalBody}</>
      </TextConfirmationModal>

      <TextConfirmationModal
        isOpen={deleteModalOpen}
        confirmationText={`redact ${script?.title}`}
        title={deleteModalTitle}
        confirmButtonLabel={deleteModalButtonLabel}
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isRemoving}
        confirmButtonLoading={isRemoving}
        onConfirm={onConfirmDelete}
        close={closeDeleteModal}
        renderInPortal
      >
        {deleteModalBody}
      </TextConfirmationModal>
    </>
  );
};

export default ScriptDetails;
