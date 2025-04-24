import useFetch from "@/hooks/useFetch";
import usePageParams from "@/hooks/usePageParams";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ScriptProfile } from "../types";
import type { PaginatedGetHookParams } from "@/types/api/PaginatedGetHookParams";

interface GetScriptProfilesParams {
  archived?: string;
  limit?: number;
  names?: string[];
  offset?: number;
  search?: string;
}

const DEFAULT_CONFIG: PaginatedGetHookParams = {
  listenToUrlParams: true,
};

export const useGetScriptProfiles = (
  config?: PaginatedGetHookParams,
  params?: GetScriptProfilesParams,
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
          archived: status || "all",
        }
      : params),
  };

  const { data: response, isLoading } = useQuery<
    AxiosResponse<ApiPaginatedResponse<ScriptProfile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["scriptProfiles", paramsWithPagination],
    queryFn: async () =>
      authFetch.get("script-profiles", { params: paramsWithPagination }),
  });

  return {
    scriptProfiles: response?.data.results ?? [],
    scriptProfilesCount: response?.data.count ?? 0,
    isGettingScriptProfiles: isLoading,
  };
};
