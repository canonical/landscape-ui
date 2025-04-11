import type { AxiosError, AxiosResponse } from "axios";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { QueryFnType } from "@/types/QueryFnType";
import type {
  DowngradePackageVersion,
  InstancePackage,
  Package,
} from "../types";

export interface GetPackagesParams {
  query: string;
  available?: boolean;
  held?: boolean;
  installed?: boolean;
  limit?: number;
  names?: string[];
  offset?: number;
  search?: string;
  security?: boolean;
  upgrade?: boolean;
}

interface GetInstancePackagesParams {
  instance_id: number;
  available?: boolean;
  held?: boolean;
  installed?: boolean;
  limit?: number;
  names?: string[];
  offset?: number;
  search?: string;
  security?: boolean;
  upgrade?: boolean;
}

export interface UpgradePackagesParams {
  query: string;
  deliver_after?: string;
  deliver_delay_window?: number;
  packages?: string[];
  security_only?: boolean;
}

interface GetDowngradePackageVersionsParams {
  instanceId: number;
  packageName: string;
}

interface DowngradePackageVersionParams {
  instanceId: number;
  package_name: string;
  package_version: string;
}

interface PackagesActionParams {
  action: "install" | "remove" | "hold" | "unhold";
  computer_ids: number[];
  package_ids: number[];
  deliver_after?: string;
  deliver_delay_window?: number;
}

export interface InstancePackagesToExclude {
  exclude_packages: number[];
  id: number;
}

interface UpgradeInstancePackagesParams {
  computers: InstancePackagesToExclude[];
}

export default function usePackages() {
  const queryClient = useQueryClient();
  const authFetchOld = useFetchOld();
  const authFetch = useFetch();

  const getPackagesQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<Package>>,
    GetPackagesParams
  > = (queryParams, config = {}) => {
    return useQuery<
      AxiosResponse<ApiPaginatedResponse<Package>>,
      AxiosError<ApiError>
    >({
      queryKey: ["packages", queryParams],
      queryFn: () =>
        authFetch.get("packages", {
          params: queryParams,
        }),
      ...config,
    });
  };

  const getInstancePackagesQuery = (
    { instance_id, ...queryParams }: GetInstancePackagesParams,
    config: Omit<
      UseQueryOptions<
        AxiosResponse<ApiPaginatedResponse<InstancePackage>>,
        AxiosError<ApiError>
      >,
      "queryKey" | "queryFn"
    > = {},
  ) => {
    return useQuery<
      AxiosResponse<ApiPaginatedResponse<InstancePackage>>,
      AxiosError<ApiError>
    >({
      queryKey: ["packages", { instance_id, ...queryParams }],
      queryFn: () =>
        authFetch.get(`computers/${instance_id}/packages`, {
          params: queryParams,
        }),
      ...config,
    });
  };

  const upgradePackagesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    UpgradePackagesParams
  >({
    mutationFn: (params) => authFetchOld.get("UpgradePackages", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["packages"] }),
  });

  const upgradeInstancesPackagesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    UpgradeInstancePackagesParams
  >({
    mutationFn: (params) =>
      authFetch.post("/computers/upgrade-packages", params),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["packages"] }),
        queryClient.invalidateQueries({ queryKey: ["instances"] }),
      ]),
  });

  const getDowngradePackageVersionsQuery = (
    { instanceId, packageName }: GetDowngradePackageVersionsParams,
    config: Omit<
      UseQueryOptions<
        AxiosResponse<{ results: DowngradePackageVersion[] }>,
        AxiosError<ApiError>
      >,
      "queryKey" | "queryFn"
    > = {},
  ) =>
    useQuery<
      AxiosResponse<{ results: DowngradePackageVersion[] }>,
      AxiosError<ApiError>
    >({
      queryKey: ["packageDowngradeVersion", { instanceId, packageName }],
      queryFn: () =>
        authFetch.get(
          `computers/${instanceId}/packages/installed/${packageName}/downgrades`,
        ),
      ...config,
    });

  const downgradePackageVersionQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    DowngradePackageVersionParams
  >({
    mutationFn: ({ instanceId, ...params }) =>
      authFetch.post(`computers/${instanceId}/packages/installed`, params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["packages"] }),
  });

  const packagesActionQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    PackagesActionParams
  >({
    mutationFn: (params) => authFetch.post("packages", params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["packages"] }),
  });

  return {
    getPackagesQuery,
    getInstancePackagesQuery,
    upgradePackagesQuery,
    getDowngradePackageVersionsQuery,
    downgradePackageVersionQuery,
    packagesActionQuery,
    upgradeInstancesPackagesQuery,
  };
}
