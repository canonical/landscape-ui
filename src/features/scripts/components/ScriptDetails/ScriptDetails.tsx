import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useGetSingleScript } from "@/features/scripts";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon, ICONS, Notification } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { lazy, Suspense } from "react";
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
        <b>Script deleted:</b> The script was deleted by{" "}
        {script.last_edited_by.name} on{" "}
        {moment(script.last_edited_at).format(DISPLAY_DATE_TIME_FORMAT)}
      </Notification>
    );
  }

  return (
    <>
      {script?.status === "ARCHIVED" ? (
        <Notification severity="caution">
          <b>Script archived:</b> The script was archived by{" "}
          {script.last_edited_by.name} on{" "}
          {moment(script.last_edited_at).format(DISPLAY_DATE_TIME_FORMAT)}
        </Notification>
      ) : null}

      {script?.status === "ACTIVE" && (
        <div className="p-segmented-control">
          <div className="p-segmented-control__list">
            <Button
              type="button"
              className="p-segmented-control__button"
              onClick={handleEditScript}
              hasIcon
              disabled={!script?.is_editable}
            >
              <Icon name="edit" />
              <span>Edit</span>
            </Button>

            <Button
              type="button"
              className="p-segmented-control__button"
              onClick={handleRunScript}
              hasIcon
              disabled={!script?.is_executable}
            >
              <Icon name="play" />
              <span>Run</span>
            </Button>

            <Button
              className="p-segmented-control__button"
              type="button"
              onClick={openModal}
              hasIcon
              aria-label={`Archive ${script?.title}`}
              disabled={!script?.is_editable}
            >
              <Icon name="archive--negative" />
              <span className="u-text--negative">Archive</span>
            </Button>

            <Button
              className="p-segmented-control__button"
              type="button"
              onClick={openDeleteModal}
              hasIcon
              aria-label={`Delete ${script?.title}`}
              disabled={!script?.is_redactable}
            >
              <Icon name={`${ICONS.delete}--negative`} />
              <span className="u-text--negative">Delete</span>
            </Button>
          </div>
        </div>
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
      >
        <>{archiveModalBody}</>
      </TextConfirmationModal>

      <TextConfirmationModal
        isOpen={deleteModalOpen}
        confirmationText={`delete ${script?.title}`}
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
    </>
  );
};

export default ScriptDetails;
