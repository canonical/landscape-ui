import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { InstalledSnap } from "../types";

interface GetInstalledSnapsParams {
  instance_id: number;
  limit?: number;
  offset?: number;
  search?: string;
}

export const useGetInstalledSnaps = (
  params: GetInstalledSnapsParams,
  options: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<InstalledSnap>>,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();
  const { instance_id, ...queryParams } = params;

  const { data, isLoading } = useQuery<
    AxiosResponse<ApiPaginatedResponse<InstalledSnap>>,
    AxiosError<ApiError>
  >({
    queryKey: ["snaps", "installed", { ...params }],
    queryFn: async () =>
      authFetch.get(`computers/${instance_id}/snaps/installed`, {
        params: queryParams,
      }),
    ...options,
  });

  return {
    installedSnaps: data?.data.results ?? [],
    installedSnapsCount: data?.data.count ?? 0,
    isInstalledSnapsLoading: isLoading,
  };
};
