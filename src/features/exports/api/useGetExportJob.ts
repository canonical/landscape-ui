import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { useEffect } from "react";
import { EXPORT_JOBS_POLL_INTERVAL_MS } from "../constants";
import type { ExportJob } from "../types/ExportJob";

export const useGetExportJob = (id: string) => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const {
    data: response,
    dataUpdatedAt,
    isLoading,
    isError,
    error,
  } = useQuery<AxiosResponse<ExportJob>, AxiosError<ApiError>>({
    queryKey: ["all-export-jobs", id],
    queryFn: async () => authFetch.get<ExportJob>(`exports/${id}`),
    enabled: !!id,
    retry: false,
    refetchInterval: (query) =>
      query.state.data?.data.status === "processing"
        ? EXPORT_JOBS_POLL_INTERVAL_MS
        : false,
    refetchIntervalInBackground: true,
  });

  const job = response?.data ?? null;
  useEffect(() => {
    if (!job) {
      return;
    }

    queryClient.setQueriesData<AxiosResponse<ApiPaginatedResponse<ExportJob>>>(
      { queryKey: ["all-export-jobs"] },
      (old) => {
        if (
          !Array.isArray(old?.data.results) ||
          !old.data.results.some((listedJob) => listedJob.id === job.id)
        ) {
          return old;
        }

        return {
          ...old,
          data: {
            ...old.data,
            results: old.data.results.map((listedJob) =>
              listedJob.id === job.id ? job : listedJob,
            ),
          },
        };
      },
    );
  }, [job, queryClient]);

  return {
    exportJob: job,
    dataUpdatedAt,
    isLoading,
    isError,
    error,
  };
};
