import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { AutoinstallFile } from "../types";

export interface GetAutoinstallFilesParams {
  is_default?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
  with_groups?: boolean;
}

export interface GetAutoinstallFilesResult {
  autoinstallFiles: AutoinstallFile[];
  autoinstallFilesCount: number | undefined;
  isAutoinstallFilesLoading: boolean;
  isFetching: boolean;
}

export const useGetAutoinstallFiles = (
  params?: GetAutoinstallFilesParams,
  config: Omit<
    UseQueryOptions<
      AxiosResponse<
        ApiPaginatedResponse<
          GetAutoinstallFilesResult["autoinstallFiles"][number]
        >,
        AxiosError<ApiError>
      >
    >,
    "queryKey" | "queryFn"
  > = {},
): GetAutoinstallFilesResult => {
  const authFetch = useFetch();

  const {
    data: response,
    isLoading,
    isFetching,
  } = useQuery<
    AxiosResponse<
      ApiPaginatedResponse<
        GetAutoinstallFilesResult["autoinstallFiles"][number]
      >
    >,
    AxiosError<ApiError>
  >({
    queryKey: ["autoinstallFiles", params],
    queryFn: async () => authFetch.get(`autoinstall`, { params }),
    ...config,
  });

  return {
    autoinstallFiles: response?.data.results ?? [],
    autoinstallFilesCount: response?.data.count,
    isAutoinstallFilesLoading: isLoading,
    isFetching,
  };
};
