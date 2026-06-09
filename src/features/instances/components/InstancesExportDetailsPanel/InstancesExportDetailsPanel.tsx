import {
  useCancelInstancesExportJob,
  useDiscardInstancesExportJob,
  useDownloadInstancesExportJob,
  useGetInstancesExportJobs,
} from "../../api";
import ListActions, {
  LIST_ACTIONS_COLUMN_PROPS,
} from "@/components/layout/ListActions";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import useNotify from "@/hooks/useNotify";
import { ModularTable, Notification } from "@canonical/react-components";
import { useEffect, useMemo, useState, type FC } from "react";
import type { CellProps, Column } from "react-table";
import { createTablePropGetters } from "@/utils/table";
import type { InstancesExportJob } from "../../types/InstancesExportJob";
import ExportProgressBar from "./components/ExportProgressBar";
import classes from "./InstancesExportDetailsPanel.module.scss";

const MS_PER_SECOND = 1000;

interface RowData extends Record<string, unknown> {
  readonly job: InstancesExportJob;
  readonly title: string;
  readonly name: string;
  readonly statusLabel: string;
  readonly secondsRemaining: number | null;
  readonly instanceCount: number;
  readonly attributes: string[];
}

const { getCellProps, getRowProps } = createTablePropGetters<RowData>({
  itemTypeName: "export row",
  headerColumnId: "name",
});

const getExportJobStatusLabel = (job: InstancesExportJob) => {
  switch (job.status) {
    case "completed":
      return "Ready";
    case "failed":
      return "Failed";
    case "canceled":
      return "Canceled";
    case "processing":
    default:
      return `Generating (${job.progress}%)`;
  }
};

const getExportJobStatusIcon = (job: InstancesExportJob): string | false => {
  switch (job.status) {
    case "completed":
      return "status-succeeded-small";
    case "failed":
      return "status-failed-small";
    case "canceled":
      return "status-queued-small";
    case "processing":
    default:
      // Processing rows render a progress bar instead of an icon + label.
      return false;
  }
};

const InstancesExportDetailsPanel: FC = () => {
  const { notify } = useNotify();
  const { expandedColumnId, expandedRowIndex, getTableRowsRef, handleExpand } =
    useExpandableRow<HTMLTableRowElement>();
  const { exportJobs, dataUpdatedAt, processingExportJobsCount } =
    useGetInstancesExportJobs();
  const { cancelInstancesExportJob } = useCancelInstancesExportJob();
  const { discardInstancesExportJob } = useDiscardInstancesExportJob();
  const { downloadInstancesExportJob } = useDownloadInstancesExportJob();

  // Tick once a second so the ETA counts down between the 5s server polls.
  // Anchored to dataUpdatedAt (last fetch) to stay correct without relying on
  // server/client clock alignment. Only runs while something is processing.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (processingExportJobsCount === 0) {
      return;
    }
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, MS_PER_SECOND);
    return () => {
      clearInterval(intervalId);
    };
  }, [processingExportJobsCount]);

  const columns = useMemo<Column<RowData>[]>(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Status",
        accessor: "statusLabel",
        Cell: ({ row }: CellProps<RowData>) => {
          const { job, statusLabel, secondsRemaining } = row.original;
          if (job.status === "processing") {
            return (
              <ExportProgressBar
                progress={job.progress}
                secondsRemaining={secondsRemaining}
              />
            );
          }
          return statusLabel;
        },
        getCellIcon: ({ row }: CellProps<RowData>) =>
          getExportJobStatusIcon(row.original.job),
      },
      {
        Header: "Attributes",
        accessor: "attributes",
        meta: {
          ariaLabel: "Attributes",
          isExpandable: true,
        },
        Cell: ({ row }: CellProps<RowData>) => (
          <TruncatedCell
            content={row.original.attributes.map((attribute) => (
              <span className="truncatedItem" key={attribute}>
                {attribute}
              </span>
            ))}
            isExpanded={
              row.index === expandedRowIndex &&
              expandedColumnId === "attributes"
            }
            onExpand={() => {
              handleExpand(row.index, "attributes");
            }}
            showCount
          />
        ),
      },
      {
        Header: "Instances",
        accessor: "instanceCount",
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        accessor: "job.id",
        Cell: ({ row }: CellProps<RowData>) => {
          const { job } = row.original;
          const actions =
            job.status === "completed"
              ? [
                  {
                    icon: "begin-downloading",
                    label: "Download",
                    onClick: async () => {
                      try {
                        await downloadInstancesExportJob(job);
                      } catch (error) {
                        if (
                          error instanceof DOMException &&
                          error.name === "AbortError"
                        ) {
                          // The user cancelled the save dialog; nothing was downloaded.
                          return;
                        }
                        throw error;
                      }

                      notify.success({
                        title: "TSV download started",
                        message: `${job.name} has been downloaded and removed from the export list.`,
                      });
                    },
                  },
                ]
              : [];
          const destructiveActions =
            job.status === "processing"
              ? [
                  {
                    icon: "close",
                    label: "Cancel",
                    onClick: async () => {
                      await cancelInstancesExportJob(job.id);
                      notify.info({
                        title: "TSV generation cancelled",
                        message: `${job.name} has been cancelled and removed from the export list.`,
                      });
                    },
                  },
                ]
              : [
                  {
                    icon: "delete",
                    label: "Discard",
                    onClick: async () => {
                      await discardInstancesExportJob(job.id);
                      notify.info({
                        title: "TSV discarded",
                        message: `${job.name} has been discarded and removed from the export list.`,
                      });
                    },
                  },
                ];

          return (
            <ListActions
              actions={actions}
              destructiveActions={destructiveActions}
              toggleAriaLabel={`Actions for ${job.name}`}
            />
          );
        },
      },
    ],
    [
      cancelInstancesExportJob,
      discardInstancesExportJob,
      downloadInstancesExportJob,
      expandedColumnId,
      expandedRowIndex,
      handleExpand,
      notify,
    ],
  );

  const data = useMemo<RowData[]>(
    () =>
      exportJobs.map((job) => {
        // Count the ETA down locally from the value captured at the last fetch.
        const secondsRemaining =
          job.estimatedSecondsRemaining == null
            ? null
            : Math.max(
                0,
                job.estimatedSecondsRemaining -
                  (now - dataUpdatedAt) / MS_PER_SECOND,
              );

        return {
          job,
          title: job.name,
          name: job.name,
          statusLabel: getExportJobStatusLabel(job),
          secondsRemaining,
          instanceCount: job.instanceCount,
          attributes: job.attributeLabels,
        };
      }),
    [exportJobs, now, dataUpdatedAt],
  );

  return (
    <>
      <Notification
        inline
        severity="caution"
        title="TSV downloads are single-use:"
      >
        Once you download a TSV, it is discarded and cannot be downloaded again.
      </Notification>
      {exportJobs.length ? (
        <div ref={getTableRowsRef}>
          <ModularTable
            className={classes.table}
            columns={columns}
            data={data}
            getCellProps={getCellProps(expandedRowIndex, expandedColumnId)}
            getRowProps={getRowProps(expandedRowIndex)}
            sortable={false}
          />
        </div>
      ) : (
        <p className={classes.emptyState}>
          You have no TSV exports in progress or waiting to be downloaded.
        </p>
      )}
    </>
  );
};

export default InstancesExportDetailsPanel;
