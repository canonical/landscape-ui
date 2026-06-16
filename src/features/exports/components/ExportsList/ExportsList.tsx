import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import ListActions from "@/components/layout/ListActions";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { Button, ConfirmationModal } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { useMemo, useState } from "react";
import type { CellProps, Column } from "react-table";
import ExportProgressBar from "../ExportProgressBar";
import {
  getStatusIcon,
  getStatusLabel,
  getTypeLabel,
} from "../../api/exportJobsShared";
import { useCancelExportJob } from "../../api/useCancelExportJob";
import { useDiscardExportJob } from "../../api/useDiscardExportJob";
import { useDownloadExportJob } from "../../api/useDownloadExportJob";
import type { ExportJob } from "../../types/ExportJob";
import type { ExportRowData } from "./types";
import useDebug from "@/hooks/useDebug";

interface ExportsListProps {
  readonly exportJobs: ExportJob[];
}

const ExportsList: FC<ExportsListProps> = ({ exportJobs }) => {
  const { notify } = useNotify();
  const debug = useDebug();
  const { createPageParamsSetter } = usePageParams();
  const { cancelExportJob: onCancel } = useCancelExportJob();
  const { discardExportJob: onDiscard } = useDiscardExportJob();
  const { downloadExportJob: onDownload } = useDownloadExportJob();
  const [jobToDiscard, setJobToDiscard] = useState<ExportJob | null>(null);

  async function handleDownload(job: ExportJob) {
    const result = await onDownload(job);
    if (result) {
      notify.success({
        title: "TSV download started",
        message: `${job.name} has been downloaded and removed from the export list.`,
      });
    }
  }

  async function handleCancel(job: ExportJob) {
    try {
      await onCancel(job.id);

      notify.success({
        title: "TSV generation cancelled",
        message: `${job.name} has been cancelled.`,
      });
    } catch (error) {
      debug(error);
    }
  }

  function handleDiscardClick(job: ExportJob) {
    setJobToDiscard(job);
  }

  function handleCloseDiscard() {
    setJobToDiscard(null);
  }

  async function handleConfirmDiscard() {
    if (!jobToDiscard) return;

    await onDiscard(jobToDiscard.id);
    setJobToDiscard(null);
    notify.success({
      title: "TSV discarded",
      message: `${jobToDiscard.name} has been discarded.`,
    });
  }

  const columns = useMemo<Column<ExportRowData>[]>(
    () => [
      {
        Header: "Name",
        accessor: "job",
        id: "name",
        Cell: ({ row }: CellProps<ExportRowData>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={createPageParamsSetter({
              sidePath: ["view"],
              name: row.original.job.id,
            })}
          >
            {row.original.job.name}
          </Button>
        ),
      },
      {
        Header: "Type",
        accessor: "job",
        id: "type",
        Cell: ({ row }: CellProps<ExportRowData>) => (
          <>{getTypeLabel(row.original.job)}</>
        ),
      },
      {
        Header: "Status",
        accessor: "job",
        id: "status",
        Cell: ({ row }: CellProps<ExportRowData>) => {
          const { job } = row.original;
          if (job.status === "processing") {
            return (
              <ExportProgressBar
                progress={job.progress}
                secondsRemaining={job.estimatedSecondsRemaining ?? null}
              />
            );
          }
          return (
            <span>
              <i className={`p-icon--${getStatusIcon(job)}`} />{" "}
              {getStatusLabel(job)}
            </span>
          );
        },
      },
      {
        Header: "Created",
        accessor: "job",
        id: "createdAt",
        Cell: ({ row }: CellProps<ExportRowData>) => (
          <>
            {moment(row.original.job.createdAt).format(
              DISPLAY_DATE_TIME_FORMAT,
            )}
          </>
        ),
      },
      {
        Header: "Expires",
        accessor: "job",
        id: "retainUntil",
        Cell: ({ row }: CellProps<ExportRowData>) => (
          <>
            {row.original.job.retainUntil
              ? moment(row.original.job.retainUntil).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )
              : "—"}
          </>
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row }: CellProps<ExportRowData>) => {
          const { job } = row.original;
          const downloadActions =
            job.status === "completed"
              ? [
                  {
                    icon: "begin-downloading",
                    label: "Download",
                    onClick: handleDownload.bind(null, job),
                  },
                ]
              : [];
          const destructiveActions =
            job.status === "processing"
              ? [
                  {
                    icon: "close",
                    label: "Cancel",
                    onClick: handleCancel.bind(null, job),
                  },
                ]
              : [
                  {
                    icon: "delete",
                    label: "Discard",
                    onClick: handleDiscardClick.bind(null, job),
                  },
                ];
          return (
            <ListActions
              actions={downloadActions}
              destructiveActions={destructiveActions}
              toggleAriaLabel={`Actions for ${job.name}`}
            />
          );
        },
      },
    ],
    [createPageParamsSetter, notify, onCancel, onDownload],
  );

  const data = useMemo<ExportRowData[]>(
    () => exportJobs.map((job) => ({ job })),
    [exportJobs],
  );

  return (
    <>
      <ResponsiveTable
        columns={columns}
        data={data}
        sortable={false}
        emptyMsg="No exports found according to your search parameters."
      />
      {jobToDiscard && (
        <ConfirmationModal
          title={`Discard "${jobToDiscard.name}"?`}
          confirmButtonLabel="Discard"
          confirmButtonAppearance="negative"
          close={handleCloseDiscard}
          onConfirm={handleConfirmDiscard}
          renderInPortal
        >
          <p>
            The export &quot;{jobToDiscard.name}&quot; will be permanently
            deleted.
          </p>
          <p>
            This action is <strong>irreversible</strong>.
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default ExportsList;
