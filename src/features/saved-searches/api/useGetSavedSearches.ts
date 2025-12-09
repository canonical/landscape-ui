import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { SavedSearch } from "../types";

interface GetSavedSearchesParams {
  limit?: number;
  offset?: number;
}

export const useGetSavedSearches = (
  params?: GetSavedSearchesParams,
  options: Omit<
    UseQueryOptions<AxiosResponse<SavedSearch[]>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetchOld();

  const { data, isLoading } = useQuery<
    AxiosResponse<SavedSearch[]>,
    AxiosError<ApiError>
  >({
    queryKey: ["savedSearches", params],
    queryFn: async () => authFetch.get("GetSavedSearches", { params }),
    ...options,
  });

  return {
    savedSearches: data?.data ?? [],
    isLoadingSavedSearches: isLoading,
  };
};
