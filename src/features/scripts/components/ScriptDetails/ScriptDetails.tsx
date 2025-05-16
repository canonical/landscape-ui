import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useGetSingleScript } from "@/features/scripts";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon, Notification } from "@canonical/react-components";
import moment from "moment";
import { type FC, lazy, Suspense, useState } from "react";
import { useArchiveScriptModal } from "../../hooks";
import type { ScriptTabId } from "../../types";
import TextConfirmationModal from "@/components/form/TextConfirmationModal";

const ScriptDetailsTabs = lazy(async () => import("../ScriptDetailsTabs"));

const EditScriptForm = lazy(async () => import("../EditScriptForm"));

interface ScriptDetailsProps {
  readonly scriptId: number;
  readonly initialTabId?: ScriptTabId;
}

const ScriptDetails: FC<ScriptDetailsProps> = ({
  scriptId,
  initialTabId = "info",
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { setSidePanelContent } = useSidePanel();
  const debug = useDebug();

  const { script } = useGetSingleScript(scriptId);

  const handleOpenModal = (): void => {
    setModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setModalOpen(false);
  };

  const {
    archiveModalBody,
    archiveModalButtonLabel,
    archiveModalTitle,
    isArchivingScript,
    onConfirmArchive,
  } = useArchiveScriptModal({
    script,
    afterSuccess: handleCloseModal,
  });

  const viewVersionHistory = (): void => {
    if (script === null) {
      debug("Script not loaded");
      return;
    }

    setSidePanelContent(
      script.title,
      <Suspense fallback={<LoadingState />}>
        <ScriptDetails scriptId={script.id} initialTabId="version-history" />
      </Suspense>,
    );
  };

  const handleEditScript = (): void => {
    if (script === null) {
      debug("Script not loaded");
      return;
    }
    setSidePanelContent(
      `Edit "${script.title}" script`,
      <Suspense fallback={<LoadingState />}>
        <EditScriptForm script={script} />
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
              className="p-segmented-control__button"
              type="button"
              onClick={handleOpenModal}
              hasIcon
              aria-label={`Archive ${script?.title}`}
              disabled={!script?.is_editable}
            >
              <Icon name="archive" />
              <span>Archive</span>
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
        close={handleCloseModal}
      >
        <>{archiveModalBody}</>
      </TextConfirmationModal>
    </>
  );
};

export default ScriptDetails;
