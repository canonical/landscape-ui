import type { InstanceListParams } from "../helpers";
import type { InstancesExportJob } from "../types/InstancesExportJob";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

export interface CreateInstancesExportJobParams extends InstanceListParams {
  readonly name: string;
  readonly selected_field_ids: string[];
}

export interface InstancesExportJobsResponse {
  readonly count: number;
  readonly results: InstancesExportJob[];
}

export const EXPORT_JOBS_QUERY_KEY = ["instances-export-jobs"];
export const EXPORT_JOBS_POLL_INTERVAL_MS = 5000;
const HTTP_STATUS_OK = 200;

const EXPORT_JOB_STATUS_ORDER: Record<InstancesExportJob["status"], number> = {
  processing: 0,
  completed: 1,
  failed: 2,
  canceled: 3,
};

const isVisibleExportJob = (job: InstancesExportJob) =>
  job.status === "processing" ||
  job.status === "completed" ||
  job.status === "failed";

export const hasProcessingExportJobs = (jobs: InstancesExportJob[]) =>
  jobs.some((job) => job.status === "processing");

export const getSortedExportJobs = (jobs: InstancesExportJob[]) =>
  [...jobs]
    .filter(isVisibleExportJob)
    .sort((left, right) => {
      if (left.status !== right.status) {
        return EXPORT_JOB_STATUS_ORDER[left.status] -
          EXPORT_JOB_STATUS_ORDER[right.status];
      }

      return (
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );
    });

export const setExportJobsCache = (
  current: InstancesExportJobsResponse | undefined,
  jobs: InstancesExportJob[],
): InstancesExportJobsResponse => {
  const sortedJobs = getSortedExportJobs(jobs);

  return {
    ...(current ?? {}),
    count: sortedJobs.length,
    results: sortedJobs,
  };
};

export const getExportJobsFromResponse = (
  response: AxiosResponse<InstancesExportJobsResponse> | undefined,
) => response?.data.results ?? [];

export const setExportJobsResponseCache = (
  current: AxiosResponse<InstancesExportJobsResponse> | undefined,
  jobs: InstancesExportJob[],
): AxiosResponse<InstancesExportJobsResponse> => ({
  data: setExportJobsCache(current?.data, jobs),
  status: current?.status ?? HTTP_STATUS_OK,
  statusText: current?.statusText ?? "OK",
  headers: current?.headers ?? {},
  config:
    current?.config ??
    ({
      headers: {},
    } as InternalAxiosRequestConfig),
});
