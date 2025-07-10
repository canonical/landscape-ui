import useFetch from "@/hooks/useFetch";
import usePageParams from "@/hooks/usePageParams";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { PaginatedGetHookParams } from "@/types/api/PaginatedGetHookParams";
import type { Instance } from "@/types/Instance";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface GetInstancesParams {
  archived_only?: boolean;
  query?: string;
  limit?: number;
  offset?: number;
  with_network?: boolean;
  with_hardware?: boolean;
  with_grouped_hardware?: boolean;
  with_annotations?: boolean;
  wsl_only?: boolean;
  with_alerts?: boolean;
  with_upgrades?: boolean;
  with_wsl_profiles?: boolean;
}

export const useGetInstances = (
  params?: GetInstancesParams,
  config?: PaginatedGetHookParams,
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<Instance>>,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  const authFetch = useFetch();
  const { currentPage, pageSize } = usePageParams();

  params =
    (config?.listenToUrlParams ?? true)
      ? {
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
          ...params,
        }
      : params;

  const {
    data: response,
    isError,
    isFetching,
    isPending,
    error,
    refetch,
  } = useQuery<
    AxiosResponse<ApiPaginatedResponse<Instance>>,
    AxiosError<ApiError>
  >({
    queryKey: ["instances", params],
    queryFn: async () => authFetch.get("computers", { params }),
    ...options,
  });

  return {
    instances: response?.data.results ?? [],
    instancesCount: response?.data.count,
    instancesError: error,
    isErrorInstances: isError,
    isFetchingInstances: isFetching,
    isGettingInstances: isPending,
    refetchInstances: refetch,
  };
};
