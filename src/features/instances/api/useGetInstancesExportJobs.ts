import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import {
  EXPORT_JOBS_POLL_INTERVAL_MS,
  EXPORT_JOBS_QUERY_KEY,
  getExportJobsFromResponse,
  getSortedExportJobs,
  hasProcessingExportJobs,
  type InstancesExportJobsResponse,
} from "./instancesExportJobsShared";

export const useGetInstancesExportJobs = () => {
  const authFetch = useFetch();

  const { data: response, dataUpdatedAt } = useQuery<
    AxiosResponse<InstancesExportJobsResponse>,
    AxiosError<ApiError>
  >({
    queryKey: EXPORT_JOBS_QUERY_KEY,
    queryFn: async () =>
      authFetch.get<InstancesExportJobsResponse>("computers/exports"),
    refetchInterval: (query) =>
      hasProcessingExportJobs(getExportJobsFromResponse(query.state.data))
        ? EXPORT_JOBS_POLL_INTERVAL_MS
        : false,
    refetchIntervalInBackground: true,
  });

  const exportJobs = getSortedExportJobs(getExportJobsFromResponse(response));

  return {
    exportJobs,
    // Timestamp (ms) of the last successful fetch — used as the anchor for the
    // client-side ETA countdown between polls.
    dataUpdatedAt,
    processingExportJobsCount: exportJobs.filter(
      (job) => job.status === "processing",
    ).length,
    readyExportJobsCount: exportJobs.filter((job) => job.status === "completed")
      .length,
  };
};
