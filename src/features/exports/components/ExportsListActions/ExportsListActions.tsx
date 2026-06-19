import ListActions from "@/components/layout/ListActions";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useCancelExportJob } from "../../api/useCancelExportJob";
import { useDiscardExportJob } from "../../api/useDiscardExportJob";
import { useDownloadExportJob } from "../../api/useDownloadExportJob";
import type { ExportJob } from "../../types/ExportJob";

interface ExportsListActionsProps {
  readonly job: ExportJob;
}

const ExportsListActions: FC<ExportsListActionsProps> = ({ job }) => {
  const { notify } = useNotify();
  const debug = useDebug();
  const { cancelExportJob: onCancel } = useCancelExportJob();
  const { discardExportJob: onDiscard } = useDiscardExportJob();
  const { downloadExportJob: onDownload } = useDownloadExportJob();

  const {
    value: isDiscardModalOpen,
    setTrue: openDiscardModal,
    setFalse: closeDiscardModal,
  } = useBoolean();

  const {
    value: isCancelModalOpen,
    setTrue: openCancelModal,
    setFalse: closeCancelModal,
  } = useBoolean();

  const handleDownload = async () => {
    try {
      const result = await onDownload(job);
      if (result) {
        notify.success({
          title: "TSV download started",
          message: `${job.name} has been downloaded and removed from the export list.`,
        });
      }
    } catch (error) {
      debug(error);
    }
  };

  const handleConfirmCancel = async () => {
    try {
      await onCancel(job.id);
      notify.success({
        title: "TSV generation cancelled",
        message: `${job.name} has been cancelled.`,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeCancelModal();
    }
  };

  const handleConfirmDiscard = async () => {
    try {
      await onDiscard(job.id);
      notify.success({
        title: "TSV discarded",
        message: `${job.name} has been discarded.`,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeDiscardModal();
    }
  };

  const downloadActions =
    job.status === "completed"
      ? [
          {
            icon: "begin-downloading" as const,
            label: "Download",
            onClick: handleDownload,
          },
        ]
      : [];

  const destructiveActions =
    job.status === "processing"
      ? [
          {
            icon: "close" as const,
            label: "Cancel",
            onClick: openCancelModal,
          },
        ]
      : [
          {
            icon: "delete" as const,
            label: "Discard",
            onClick: openDiscardModal,
          },
        ];

  return (
    <>
      <ListActions
        actions={downloadActions}
        destructiveActions={destructiveActions}
        toggleAriaLabel={`Actions for ${job.name}`}
      />
      {isDiscardModalOpen && (
        <ConfirmationModal
          title={`Discard "${job.name}"?`}
          confirmButtonLabel="Discard"
          confirmButtonAppearance="negative"
          close={closeDiscardModal}
          onConfirm={handleConfirmDiscard}
          renderInPortal
        >
          <p>The export &quot;{job.name}&quot; will be permanently deleted.</p>
          <p>
            This action is <strong>irreversible</strong>.
          </p>
        </ConfirmationModal>
      )}
      {isCancelModalOpen && (
        <ConfirmationModal
          title={`Cancel "${job.name}"?`}
          confirmButtonLabel="Confirm"
          confirmButtonAppearance="negative"
          close={closeCancelModal}
          onConfirm={handleConfirmCancel}
          renderInPortal
        >
          <p>The export &quot;{job.name}&quot; is still being generated.</p>
          <p>
            Cancelling it will stop the generation and discard any partial
            results.
          </p>
          <p>
            This action is <strong>irreversible</strong>.
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default ExportsListActions;
