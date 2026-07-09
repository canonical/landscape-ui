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

export const getExportTitle = ({
  isAllSelected,
  selectedCount,
  totalCount,
  selectionForms,
}: {
  isAllSelected: boolean;
  selectedCount: number;
  totalCount: number | undefined;
  selectionForms: readonly [singular: string, plural?: string];
}): string => {
  if (!isAllSelected && selectedCount > 0) {
    return `Export ${pluralize(selectedCount, selectionForms, "exact")} as TSV`;
  }

  if (totalCount !== undefined) {
    return `Export ${pluralize(totalCount, selectionForms, "exact")} as TSV`;
  }

  return `Export ${pluralize(0, selectionForms)} as TSV`;
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

export const getTypeLabel = (job: ExportJob): string =>
  job.type === "activity" ? "Activities" : "Instances";
