import type { ExportJob } from "./types/ExportJob";

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


