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

export const getTypeIcon = (job: ExportJob): string => {
  switch (job.type) {
    case "activity":
      return "switcher-environments";
    case "report":
      return "file";
    default:
      return "machines";
  }
};
