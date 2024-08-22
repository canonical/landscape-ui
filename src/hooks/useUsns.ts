import useFetch from "./useFetch";
import { AxiosError, AxiosResponse } from "axios";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { ApiError } from "@/types/ApiError";
import { Usn, UsnPackage } from "@/types/Usn";
import { Activity } from "@/features/activities";

export interface GetUsnsParams {
  computer_ids: number[];
  limit?: number;
  offset?: number;
  search?: string;
  show_packages?: boolean;
}

export interface GetAffectedPackagesParams {
  computer_ids: number[];
  usn: string;
}

export interface UpgradeUsnPackagesParams {
  instanceId: number;
  usns: string[];
}

export interface RemoveUsnPackagesParams {
  instanceId: number;
  usns: string;
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
      queryFn: () => authFetch!.get("usns", { params: queryParams }),
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
      queryFn: () => authFetch!.get(`usns/${usn}`, { params: queryParams }),
      ...config,
    });
  };

  const upgradeUsnPackagesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    UpgradeUsnPackagesParams
  >({
    mutationFn: ({ instanceId, ...params }) =>
      authFetch!.post(`/computers/${instanceId}/usns/upgrade-packages`, params),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(["usns"]),
        queryClient.invalidateQueries(["activities"]),
      ]),
  });

  const removeUsnPackagesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemoveUsnPackagesParams
  >({
    mutationFn: ({ instanceId, ...params }) =>
      authFetch!.post(`/computers/${instanceId}/usns/remove-packages`, params),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(["usns"]),
        queryClient.invalidateQueries(["activities"]),
      ]),
  });

  return {
    getUsnsQuery,
    getAffectedPackagesQuery,
    upgradeUsnPackagesQuery,
    removeUsnPackagesQuery,
  };
}
