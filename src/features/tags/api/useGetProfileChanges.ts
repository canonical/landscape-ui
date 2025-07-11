import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ProfileChange } from "../types/ProfileChange";

export interface UseGetProfileChangesParams {
  instance_ids: number[];
  tags: string[];
  limit?: number;
  offset?: number;
}

export const useGetProfileChanges = (
  params: UseGetProfileChangesParams,
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<ProfileChange>, AxiosError<ApiError>>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  const authFetch = useFetch();

  const { data, isFetching, isPending, refetch } = useQuery<
    AxiosResponse<ApiPaginatedResponse<ProfileChange>>,
    AxiosError<ApiError>
  >({
    queryKey: ["profileChanges", params],
    queryFn: async () => authFetch.get("tags/profile-diff", { params }),
    ...options,
  });

  return {
    isFetchingProfileChanges: isFetching,
    isPendingProfileChanges: isPending,
    profileChanges: data?.data.results ?? [],
    profileChangesCount: data?.data.count ?? 0,
    refetchProfileChanges: refetch,
  };
};
