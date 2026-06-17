import type { InstanceListParams } from "../helpers";
import type { InstancesExportJob } from "../types/InstancesExportJob";

export interface CreateInstancesExportJobParams extends InstanceListParams {
  readonly name: string;
  readonly selected_field_ids: string[];
  readonly retain_until: string;
}

export interface InstancesExportJobsResponse {
  readonly count: number;
  readonly results: InstancesExportJob[];
}

export const hasProcessingExportJobs = (jobs: InstancesExportJob[]) =>
  jobs.some((job) => job.status === "processing");

export const getStatusLabel = (job: InstancesExportJob): string => {
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
