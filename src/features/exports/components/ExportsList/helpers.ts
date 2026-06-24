import type { ExportJob } from "../../types/ExportJob";

export const getStatusIcon = (job: ExportJob): string => {
  switch (job.status) {
    case "completed":
      return "success";
    case "failed":
      return "error";
    case "processing":
    default:
      return "status-in-progress-small";
  }
};

export const getTypeIcon = (job: ExportJob): string =>
  job.type === "activity" ? "switcher-environments" : "machines";
