import useFetch from "@/hooks/useFetch";
import usePageParams from "@/hooks/usePageParams";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { EXPORT_JOBS_POLL_INTERVAL_MS } from "../constants";
import type { ExportJob } from "../types/ExportJob";
import { hasProcessingExportJobs } from "../helpers";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";

interface GetAllExportJobsListParams {
  search?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

interface GetAllExportJobsListConfig {
  listenToUrlParams?: boolean;
  enablePolling?: boolean;
}

export const useGetAllExportJobsList = (
  params: GetAllExportJobsListParams = {},
  {
    listenToUrlParams = true,
    enablePolling = true,
  }: GetAllExportJobsListConfig = {},
) => {
  const authFetch = useFetch();
  const { currentPage, pageSize, search, type } = usePageParams();

  const paramsWithPagination = {
    ...(listenToUrlParams
      ? {
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
          search: search ?? undefined,
          type: type ?? undefined,
        }
      : params),
  };

  const {
    data: response,
    isLoading,
    dataUpdatedAt,
  } = useQuery<
    AxiosResponse<ApiPaginatedResponse<ExportJob>>,
    AxiosError<ApiError>
  >({
    queryKey: ["all-export-jobs", paramsWithPagination],
    queryFn: async () =>
      authFetch.get<ApiPaginatedResponse<ExportJob>>("exports", {
        params: paramsWithPagination,
      }),
    refetchInterval: (query) =>
      enablePolling &&
      hasProcessingExportJobs(query.state.data?.data.results ?? [])
        ? EXPORT_JOBS_POLL_INTERVAL_MS
        : false,
    refetchIntervalInBackground: enablePolling,
  });

  return {
    exportJobs: response?.data?.results ?? [],
    totalCount: response?.data?.count ?? 0,
    isLoading,
    dataUpdatedAt,
  };
};
