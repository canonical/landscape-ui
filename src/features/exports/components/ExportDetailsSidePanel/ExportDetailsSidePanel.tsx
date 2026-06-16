import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import SidePanel from "@/components/layout/SidePanel";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import {
  Button,
  ConfirmationModal,
  Icon,
  ICONS,
} from "@canonical/react-components";
import moment from "moment";
import { useState, type FC } from "react";
import ExportProgressBar from "../ExportProgressBar";
import { getStatusLabel, getTypeLabel } from "../../api/exportJobsShared";
import { useCancelExportJob } from "../../api/useCancelExportJob";
import { useDiscardExportJob } from "../../api/useDiscardExportJob";
import { useDownloadExportJob } from "../../api/useDownloadExportJob";
import { useGetExportJob } from "../../api/useGetExportJob";
import { getFilterValue } from "./helpers";
import NoData from "@/components/layout/NoData";

const ExportDetailsSidePanel: FC = () => {
  const { name: jobId, popSidePathUntilClear } = usePageParams();
  const { notify } = useNotify();

  const { exportJob: job } = useGetExportJob(jobId ?? "");
  const { cancelExportJob: onCancel } = useCancelExportJob();
  const { discardExportJob: onDiscard } = useDiscardExportJob();
  const { downloadExportJob: onDownload } = useDownloadExportJob();

  const [confirmDiscard, setConfirmDiscard] = useState(false);

  async function handleDownload() {
    if (!job) {
      return;
    }

    const result = await onDownload(job);
    if (result) {
      notify.success({
        title: "TSV download started",
        message: `${job.name} has been downloaded and removed from the export list.`,
      });
    }
  }

  async function handleCancel() {
    if (!job) {
      return;
    }

    await onCancel(job.id);
    notify.success({
      title: "TSV generation cancelled",
      message: `${job.name} has been cancelled.`,
    });
  }

  function handleOpenDiscard() {
    setConfirmDiscard(true);
  }

  function handleCloseDiscard() {
    setConfirmDiscard(false);
  }

  async function handleConfirmDiscard() {
    if (!job) {
      return;
    }

    await onDiscard(job.id);
    setConfirmDiscard(false);
    popSidePathUntilClear();
    notify.success({
      title: "TSV discarded",
      message: `${job.name} has been discarded.`,
    });
  }

  if (!job) {
    return <SidePanel.LoadingState />;
  }

  const countLabel = getTypeLabel(job);

  return (
    <>
      <SidePanel.Header>{job.name}</SidePanel.Header>
      <SidePanel.Content>
        <div className="p-segmented-control">
          <div className="p-segmented-control__list">
            {job.status === "completed" && (
              <Button
                type="button"
                hasIcon
                className="p-segmented-control__button"
                onClick={handleDownload}
              >
                <Icon name="begin-downloading" />
                <span>Download</span>
              </Button>
            )}
            {job.status === "processing" && (
              <Button
                type="button"
                hasIcon
                className="p-segmented-control__button"
                onClick={handleCancel}
              >
                <Icon name="close--negative" />
                <span className="u-text--negative">Cancel</span>
              </Button>
            )}
            {job.status !== "processing" && (
              <Button
                type="button"
                hasIcon
                className="p-segmented-control__button"
                onClick={handleOpenDiscard}
              >
                <Icon name={`${ICONS.delete}--negative`} />
                <span className="u-text--negative">Discard</span>
              </Button>
            )}
          </div>
        </div>

        <Blocks>
          <Blocks.Item title="Details">
            <InfoGrid dense>
              <InfoGrid.Item
                label="Status"
                value={
                  job.status === "processing" ? (
                    <ExportProgressBar
                      progress={job.progress}
                      secondsRemaining={job.estimatedSecondsRemaining ?? null}
                      fullWidth
                    />
                  ) : (
                    getStatusLabel(job)
                  )
                }
                large
              />
              <InfoGrid.Item
                label={countLabel}
                value={job.rowCount.toLocaleString()}
              />
              <InfoGrid.Item
                label="Created"
                value={moment(job.createdAt).format(DISPLAY_DATE_TIME_FORMAT)}
              />
              <InfoGrid.Item
                label="Expires"
                value={
                  job.retainUntil ? (
                    moment(job.retainUntil).format(DISPLAY_DATE_TIME_FORMAT)
                  ) : (
                    <NoData />
                  )
                }
              />
              <InfoGrid.Item label="Filter" value={getFilterValue(job)} large />
            </InfoGrid>
          </Blocks.Item>
        </Blocks>
      </SidePanel.Content>
      {confirmDiscard && (
        <ConfirmationModal
          title={`Discard "${job.name}"?`}
          confirmButtonLabel="Discard"
          confirmButtonAppearance="negative"
          close={handleCloseDiscard}
          onConfirm={handleConfirmDiscard}
          renderInPortal
        >
          <p>The export &quot;{job.name}&quot; will be permanently deleted.</p>
          <p>
            This action is <strong>irreversible</strong>.
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default ExportDetailsSidePanel;
