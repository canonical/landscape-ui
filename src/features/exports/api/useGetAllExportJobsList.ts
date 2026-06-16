import useFetch from "@/hooks/useFetch";
import usePageParams from "@/hooks/usePageParams";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { EXPORT_JOBS_POLL_INTERVAL_MS } from "../constants";
import {
  hasProcessingExportJobs,
  type AllExportJobsResponse,
} from "./exportJobsShared";

const DEFAULT_EXPORT_JOBS_PAGE_SIZE = 50;

interface GetAllExportJobsListParams {
  search?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

interface GetAllExportJobsListConfig {
  listenToUrlParams?: boolean;
}

export const useGetAllExportJobsList = (
  params: GetAllExportJobsListParams = {},
  { listenToUrlParams = true }: GetAllExportJobsListConfig = {},
) => {
  const authFetch = useFetch();
  const {
    currentPage,
    pageSize,
    search: urlSearch,
    type: urlType,
  } = usePageParams();

  const {
    search = listenToUrlParams ? urlSearch : "",
    type = listenToUrlParams ? urlType : "",
    limit = listenToUrlParams ? pageSize : DEFAULT_EXPORT_JOBS_PAGE_SIZE,
    offset = listenToUrlParams ? (currentPage - 1) * pageSize : 0,
  } = params;

  const {
    data: response,
    isLoading,
    dataUpdatedAt,
  } = useQuery<AxiosResponse<AllExportJobsResponse>, AxiosError<ApiError>>({
    queryKey: ["all-export-jobs", { search, type, limit, offset }],
    queryFn: async () =>
      authFetch.get<AllExportJobsResponse>("exports", {
        params: { search, type: type || undefined, limit, offset },
      }),
    refetchInterval: (query) =>
      hasProcessingExportJobs(query.state.data?.data.results ?? [])
        ? EXPORT_JOBS_POLL_INTERVAL_MS
        : false,
    refetchIntervalInBackground: true,
  });

  return {
    exportJobs: response?.data?.results ?? [],
    totalCount: response?.data?.count ?? 0,
    isLoading,
    dataUpdatedAt,
  };
};
