import { AxiosError, AxiosResponse } from "axios";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import { ApiError } from "@/types/ApiError";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { Usn, UsnPackage } from "@/types/Usn";

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

  const upgradeInstanceUsnsQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    UpgradeInstanceUsnsParams
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

  const upgradeUsnsQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    UpgradeUsnsParams
  >({
    mutationFn: (params) =>
      authFetch!.post("/computers/usns/upgrade-packages", params),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(["usns"]),
        queryClient.invalidateQueries(["activities"]),
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
