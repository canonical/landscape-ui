import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import SidePanel from "@/components/layout/SidePanel";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import {
  Button,
  ConfirmationButton,
  Icon,
  ICONS,
} from "@canonical/react-components";
import moment from "moment";
import { type FC } from "react";
import useDebug from "@/hooks/useDebug";
import ExportProgressBar from "../ExportProgressBar";
import { getStatusLabel, getTypeLabel } from "../../helpers";
import { useCancelExportJob } from "../../api/useCancelExportJob";
import { useDiscardExportJob } from "../../api/useDiscardExportJob";
import { useDownloadExportJob } from "../../api/useDownloadExportJob";
import { useGetExportJob } from "../../api/useGetExportJob";
import { getFilterValue } from "./helpers";

const ExportDetailsSidePanel: FC = () => {
  const { name: jobId, popSidePathUntilClear } = usePageParams();
  const { notify } = useNotify();
  const debug = useDebug();

  const { exportJob: job } = useGetExportJob(jobId ?? "");
  const { cancelExportJob: onCancel } = useCancelExportJob();
  const { discardExportJob: onDiscard } = useDiscardExportJob();
  const { downloadExportJob: onDownload } = useDownloadExportJob();

  const handleDownload = async () => {
    if (!job) {
      return;
    }

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
    if (!job) {
      return;
    }

    try {
      await onCancel(job.id);
      notify.success({
        title: "TSV generation cancelled",
        message: `${job.name} has been cancelled.`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleConfirmDiscard = async () => {
    if (!job) {
      return;
    }

    try {
      await onDiscard(job.id);
      popSidePathUntilClear();
      notify.success({
        title: "TSV discarded",
        message: `${job.name} has been discarded.`,
      });
    } catch (error) {
      debug(error);
    }
  };

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
              <ConfirmationButton
                type="button"
                className="p-button has-icon p-segmented-control__button"
                confirmationModalProps={{
                  title: `Cancel "${job.name}"?`,
                  confirmButtonLabel: "Confirm",
                  confirmButtonAppearance: "negative",
                  onConfirm: handleConfirmCancel,
                  children: (
                    <>
                      <p>
                        The export &quot;{job.name}&quot; is still being
                        generated.
                      </p>
                      <p>
                        Cancelling it will stop the generation and discard any
                        partial results.
                      </p>
                      <p>
                        This action is <strong>irreversible</strong>.
                      </p>
                    </>
                  ),
                }}
              >
                <Icon name="close--negative" />
                <span className="u-text--negative">Cancel</span>
              </ConfirmationButton>
            )}
            {job.status !== "processing" && (
              <ConfirmationButton
                type="button"
                className="p-button has-icon p-segmented-control__button"
                confirmationModalProps={{
                  title: `Discard "${job.name}"?`,
                  confirmButtonLabel: "Discard",
                  confirmButtonAppearance: "negative",
                  onConfirm: handleConfirmDiscard,
                  children: (
                    <>
                      <p>
                        The export &quot;{job.name}&quot; will be permanently
                        deleted.
                      </p>
                      <p>
                        This action is <strong>irreversible</strong>.
                      </p>
                    </>
                  ),
                }}
              >
                <Icon name={`${ICONS.delete}--negative`} />
                <span className="u-text--negative">Discard</span>
              </ConfirmationButton>
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
                      secondsRemaining={job.estimated_seconds_remaining ?? null}
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
                value={job.row_count.toLocaleString()}
              />
              <InfoGrid.Item
                label="Created"
                value={moment(job.created_at).format(DISPLAY_DATE_TIME_FORMAT)}
              />
              <InfoGrid.Item
                label="Expires"
                value={moment(job.retain_until).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )}
              />
              <InfoGrid.Item label="Filter" value={getFilterValue(job)} large />
            </InfoGrid>
          </Blocks.Item>
        </Blocks>
      </SidePanel.Content>
    </>
  );
};

export default ExportDetailsSidePanel;
