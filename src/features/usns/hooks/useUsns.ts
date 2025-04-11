import type { AxiosError, AxiosResponse } from "axios";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { Usn, UsnPackage } from "@/types/Usn";

export interface GetUsnsParams {
  computer_ids: number[];
  limit?: number;
  offset?: number;
  search?: string;
  show_packages?: boolean;
}

interface GetAffectedPackagesParams {
  computer_ids: number[];
  usn: string;
}

interface UpgradeInstanceUsnsParams {
  instanceId: number;
  usns: string[];
}

interface RemoveUsnPackagesParams {
  instanceId: number;
  usns: string;
}

interface InstanceUsnsToExclude {
  id: number;
  exclude_usns: string[];
}

interface UpgradeUsnsParams {
  computers: InstanceUsnsToExclude[];
}

export default function useUsns() {
  const queryClient = useQueryClient();
  const authFetch = useFetch();

  const getUsnsQuery = (
    queryParams: GetUsnsParams,
    config: Omit<
      UseQueryOptions<
        AxiosResponse<ApiPaginatedResponse<Usn>>,
        AxiosError<ApiError>
      >,
      "queryKey" | "queryFn"
    > = {},
  ) => {
    return useQuery<
      AxiosResponse<ApiPaginatedResponse<Usn>>,
      AxiosError<ApiError>
    >({
      queryKey: ["usns", queryParams],
      queryFn: () => authFetch.get("usns", { params: queryParams }),
      ...config,
    });
  };

  const getAffectedPackagesQuery = (
    { usn, ...queryParams }: GetAffectedPackagesParams,
    config: Omit<
      UseQueryOptions<AxiosResponse<UsnPackage[]>, AxiosError<ApiError>>,
      "queryKey" | "queryFn"
    > = {},
  ) => {
    return useQuery<AxiosResponse<UsnPackage[]>, AxiosError<ApiError>>({
      queryKey: ["usnPackages", { usn, ...queryParams }],
      queryFn: () => authFetch.get(`usns/${usn}`, { params: queryParams }),
      ...config,
    });
  };

  const upgradeInstanceUsnsQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    UpgradeInstanceUsnsParams
  >({
    mutationFn: ({ instanceId, ...params }) =>
      authFetch.post(`/computers/${instanceId}/usns/upgrade-packages`, params),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["usns"] }),
        queryClient.invalidateQueries({ queryKey: ["activities"] }),
      ]),
  });

  const removeUsnPackagesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemoveUsnPackagesParams
  >({
    mutationFn: ({ instanceId, ...params }) =>
      authFetch.post(`/computers/${instanceId}/usns/remove-packages`, params),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["usns"] }),
        queryClient.invalidateQueries({ queryKey: ["activities"] }),
      ]),
  });

  const upgradeUsnsQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    UpgradeUsnsParams
  >({
    mutationFn: (params) =>
      authFetch.post("/computers/usns/upgrade-packages", params),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["usns"] }),
        queryClient.invalidateQueries({ queryKey: ["activities"] }),
      ]),
  });

  return {
    getUsnsQuery,
    getAffectedPackagesQuery,
    upgradeInstanceUsnsQuery,
    removeUsnPackagesQuery,
    upgradeUsnsQuery,
  };
}
