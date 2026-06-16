import type { ExportJob } from "../types/ExportJob";

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

export const getStatusIcon = (job: ExportJob): string => {
  switch (job.status) {
    case "completed":
      return "status-succeeded-small";
    case "failed":
      return "status-failed-small";
    case "processing":
    default:
      return "status-in-progress-small";
  }
};

export const getTypeLabel = (job: ExportJob): string =>
  job.type === "activity" ? "Activities" : "Instances";

export interface AllExportJobsResponse {
  readonly count: number;
  readonly results: ExportJob[];
}
