import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { EXPORT_JOBS_POLL_INTERVAL_MS } from "../constants";
import type { ExportJob } from "../types/ExportJob";

export const useGetExportJob = (id: string) => {
  const authFetch = useFetch();

  const {
    data: response,
    dataUpdatedAt,
    isLoading,
  } = useQuery<AxiosResponse<ExportJob>, AxiosError<ApiError>>({
    queryKey: ["all-export-jobs", id],
    queryFn: async () => authFetch.get<ExportJob>(`exports/${id}`),
    refetchInterval: (query) =>
      query.state.data?.data.status === "processing"
        ? EXPORT_JOBS_POLL_INTERVAL_MS
        : false,
    refetchIntervalInBackground: true,
  });

  return {
    exportJob: response?.data ?? null,
    dataUpdatedAt,
    isLoading,
  };
};
