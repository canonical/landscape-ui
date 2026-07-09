import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import ProgressBar from "@/components/ProgressBar";
import ExportsListActions from "../ExportsListActions";
import { getStatusLabel, getTypeLabel } from "../../helpers";
import { getStatusIcon, getTypeIcon } from "./helpers";
import type { ExportJob } from "../../types/ExportJob";
import type { ExportRowData } from "./types";
import classes from "./ExportsList.module.scss";

interface ExportsListProps {
  readonly exportJobs: ExportJob[];
}

const ExportsList: FC<ExportsListProps> = ({ exportJobs }) => {
  const { createPageParamsSetter } = usePageParams();

  const columns = useMemo<Column<ExportRowData>[]>(
    () => [
      {
        Header: "Name",
        accessor: "job.name",
        Cell: ({ row }: CellProps<ExportRowData>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={createPageParamsSetter({
              sidePath: ["view"],
              name: String(row.original.job.id),
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
        getCellIcon: ({ row: { original } }: CellProps<ExportRowData>) =>
          getTypeIcon(original.job),
      },
      {
        Header: "Status",
        accessor: "job",
        id: "status",
        className: classes.status,
        Cell: ({ row }: CellProps<ExportRowData>) => {
          const { job } = row.original;
          if (job.status === "processing") {
            return (
              <ProgressBar
                progress={job.progress}
                secondsRemaining={job.estimated_seconds_remaining ?? null}
                label={`${job.name} export progress`}
                loading
              />
            );
          }
          return <>{getStatusLabel(job)}</>;
        },
        getCellIcon: ({ row: { original } }: CellProps<ExportRowData>) => {
          return original.job.status === "processing"
            ? false
            : getStatusIcon(original.job);
        },
      },
      {
        Header: "Created",
        accessor: "job.created_at",
        Cell: ({ row }: CellProps<ExportRowData>) => (
          <span className="font-monospace">
            {moment(row.original.job.created_at).format(
              DISPLAY_DATE_TIME_FORMAT,
            )}
          </span>
        ),
      },
      {
        Header: "Expires",
        accessor: "job.retain_until",
        Cell: ({ row }: CellProps<ExportRowData>) => (
          <span className="font-monospace">
            {moment(row.original.job.retain_until).format(
              DISPLAY_DATE_TIME_FORMAT,
            )}
          </span>
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row }: CellProps<ExportRowData>) => (
          <ExportsListActions job={row.original.job} />
        ),
      },
    ],
    [createPageParamsSetter],
  );

  const data = useMemo<ExportRowData[]>(
    () => exportJobs.map((job) => ({ job })),
    [exportJobs],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={data}
      sortable={false}
      emptyMsg="No exports found according to your search parameters."
    />
  );
};

export default ExportsList;
