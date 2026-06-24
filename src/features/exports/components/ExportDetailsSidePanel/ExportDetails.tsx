import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import {
  Button,
  ConfirmationButton,
  Icon,
  ICONS,
} from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { useCancelExportJob } from "../../api/useCancelExportJob";
import { useDiscardExportJob } from "../../api/useDiscardExportJob";
import { useDownloadExportJob } from "../../api/useDownloadExportJob";
import { useRetryExportJob } from "../../api/useRetryExportJob";
import { getStatusLabel, getTypeLabel } from "../../helpers";
import type { ExportJob } from "../../types/ExportJob";
import ExportProgressBar from "../ExportProgressBar";
import { getFilterValue } from "./helpers";

interface ExportDetailsProps {
  readonly job: ExportJob;
}

const ExportDetails: FC<ExportDetailsProps> = ({ job }) => {
  const { popSidePathUntilClear, setPageParams } = usePageParams();
  const { notify } = useNotify();
  const debug = useDebug();

  const { cancelExportJob: onCancel } = useCancelExportJob();
  const { discardExportJob: onDiscard } = useDiscardExportJob();
  const { downloadExportJob: onDownload } = useDownloadExportJob();
  const { retryExportJob: onRetry } = useRetryExportJob();

  const handleDownload = async () => {
    try {
      const result = await onDownload(job);
      if (result) {
        notify.success({
          title: "TSV download started",
          message: `${job.name} has been downloaded and removed from the export list.`,
        });
      }
      popSidePathUntilClear();
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
    }
  };

  const handleConfirmDiscard = async () => {
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

  const handleRetry = async () => {
    try {
      const { data: newJob } = await onRetry(job.id);
      setPageParams({ name: String(newJob.id) });
    } catch (error) {
      debug(error);
    }
  };

  const countLabel = getTypeLabel(job);

  return (
    <>
      <div className="p-segmented-control">
        <div className="p-segmented-control__list">
          {job.download_ready && (
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
          {job.status === "failed" && (
            <Button
              type="button"
              hasIcon
              className="p-segmented-control__button"
              onClick={handleRetry}
            >
              <Icon name="restart" />
              <span>Retry</span>
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
                  <span className="u-flex--align-center">
                    <Icon
                      name={job.status === "completed" ? "success" : "error"}
                      className="u-no-margin--right"
                    />{" "}
                    {getStatusLabel(job)}
                  </span>
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
              value={
                <span className="font-monospace">
                  {moment(job.created_at).format(DISPLAY_DATE_TIME_FORMAT)}
                </span>
              }
            />
            <InfoGrid.Item
              label="Expires"
              value={
                <span className="font-monospace">
                  {moment(job.retain_until).format(DISPLAY_DATE_TIME_FORMAT)}
                </span>
              }
            />
            <InfoGrid.Item label="Filter" value={getFilterValue(job)} large />
          </InfoGrid>
        </Blocks.Item>
      </Blocks>
    </>
  );
};

export default ExportDetails;
