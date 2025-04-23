import type { Script } from "@/features/scripts";
import useFetch from "@/hooks/useFetch";
import usePageParams from "@/hooks/usePageParams";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { PaginatedGetHookParams } from "@/types/api/PaginatedGetHookParams";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface UseGetScriptsParams {
  script_type?: "active" | "archived" | "redacted";
}

const DEFAULT_CONFIG: PaginatedGetHookParams = {
  listenToUrlParams: true,
};

export const useGetScripts = (
  config?: PaginatedGetHookParams,
  params?: UseGetScriptsParams,
) => {
  const authFetch = useFetch();
  const { currentPage, pageSize, status, search } = usePageParams();

  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const paramsWithPagination = {
    ...(config.listenToUrlParams
      ? {
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
          search: search ?? undefined,
          script_type: status || "v2",
        }
      : {}),
    ...params,
  };

  const { data, isLoading } = useQuery<
    AxiosResponse<ApiPaginatedResponse<Script>>,
    AxiosError<ApiError>
  >({
    queryKey: ["scripts", paramsWithPagination],
    queryFn: async () =>
      authFetch.get("scripts", {
        params: paramsWithPagination,
      }),
  });

  return {
    scripts: data?.data.results ?? [],
    scriptsCount: data?.data.count ?? 0,
    isScriptsLoading: isLoading,
  };
};
