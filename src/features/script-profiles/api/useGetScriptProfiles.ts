import useFetch from "@/hooks/useFetch";
import usePageParams from "@/hooks/usePageParams";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ScriptProfile } from "../types";

interface GetScriptProfilesParams {
  archived?: string;
  limit?: number;
  names?: string[];
  offset?: number;
  search?: string;
}

export const useGetScriptProfiles = (params: GetScriptProfilesParams = {}) => {
  const authFetch = useFetch();
  const { currentPage, pageSize, status, search } = usePageParams();

  params = {
    archived: status || "all",
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: search,
    ...params,
  };

  const { data: response, isLoading } = useQuery<
    AxiosResponse<ApiPaginatedResponse<ScriptProfile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["scriptProfiles", params],
    queryFn: async () => authFetch.get("script-profiles", { params }),
  });

  return {
    scriptProfiles: response?.data.results ?? [],
    scriptProfilesCount: response?.data.count,
    isGettingScriptProfiles: isLoading,
  };
};
