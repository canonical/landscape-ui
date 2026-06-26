import { pluralize } from "@/utils/_helpers";
import type { ExportJob } from "./types/ExportJob";

export const buildExportQuery = ({
  query,
  selectedIds,
}: {
  query?: string;
  selectedIds?: number[];
}): string => {
  if (selectedIds?.length) {
    return selectedIds.map((id) => `id:${id}`).join(" OR ");
  }

  return query?.trim() ?? "";
};

export const getExportScope = ({
  query,
  selectedCount,
  selectionForms,
}: {
  query?: string;
  selectedCount?: number;
  selectionForms: readonly [singular: string, plural: string];
}): string => {
  if (selectedCount) {
    return ` for ${pluralize(selectedCount, selectionForms, "exact")}`;
  }

  return query ? ` for "${query}"` : "";
};

export const hasProcessingExportJobs = (jobs: ExportJob[]) =>
  jobs.some((job) => job.status === "processing");

export const getStatusLabel = (job: ExportJob): string => {
  switch (job.status) {
    case "completed":
      return "Ready";
    case "failed":
      return "Failed";
    case "processing":
    default:
      return `Generating (${job.progress}%)`;
  }
};

export const getTypeLabel = (job: ExportJob, source?: string): string => {
  switch (job.type) {
    case "activity":
      return "Activities";
    case "report":
      if (source === "details") {
        return "Instances in report";
      }
      return "Report";
    default:
      return "Instances";
  }
};
