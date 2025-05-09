import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { TruncatedScriptVersion } from "../types";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";

interface GetScriptVersionsParams {
  scriptId: number;
  limit?: number;
  offset?: number;
}

export const useGetScriptVersions = ({
  scriptId,
  limit,
  offset,
}: GetScriptVersionsParams) => {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<ApiPaginatedResponse<TruncatedScriptVersion>>,
    AxiosError<ApiError>
  >({
    queryKey: ["scripts", "versions", scriptId, limit, offset],
    queryFn: async () =>
      authFetch.get(`scripts/${scriptId}/versions`, {
        params: {
          limit,
          offset,
        },
      }),
  });

  return {
    versions: response?.data.results ?? [],
    isVersionsLoading: isLoading,
    count: response?.data.count,
  };
};
