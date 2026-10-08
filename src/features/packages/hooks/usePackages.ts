import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { QueryFnType } from "@/types/api/QueryFnType";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { FilterState } from "../types";
import type {
  ComputerPackageSearchGroupedResponse,
  ComputerPackageSearchParams,
  DowngradePackageVersion,
  InstancePackage,
  Package,
  SearchPackagesResponse,
  SearchUpgradesRequest,
} from "../types";
import { mapGroupedResultToInstancePackage } from "../helpers";

interface GetInstancePackagesParams extends ComputerPackageSearchParams {
  instance_id: number;
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

const sanitizeFilterState = (state?: FilterState): FilterState | undefined => {
  if (!state || state === FilterState.UNSPECIFIED) {
    return undefined;
  }

  return state;
};

const sanitizeSearchUpgradesRequest = (
  request?: SearchUpgradesRequest,
): SearchUpgradesRequest => {
  const names = request?.names?.length ? request.names : undefined;
  const text = request?.text || undefined;

  return {
    computer_query: request?.computer_query ?? "",
    text,
    names,
    security: sanitizeFilterState(request?.security),
    limit: request?.limit,
    offset: request?.offset,
  };
};

const mapSearchResponseToPaginatedPackages = (
  response: SearchPackagesResponse,
): ApiPaginatedResponse<Package> => ({
  results: response.packages.map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    summary: pkg.summary,
    computers: {
      count: pkg.computers.count,
    },
  })),
  count: response.count,
  next: response.next,
  previous: response.prev,
});

export default function usePackages() {
  const queryClient = useQueryClient();
  const authFetchOld = useFetchOld();
  const authFetch = useFetch();

  const getPackageUpgradesQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<Package>>,
    SearchUpgradesRequest
  > = (request, config = {}) => {
    const sanitizedRequest = sanitizeSearchUpgradesRequest(request);

    return useQuery<
      AxiosResponse<ApiPaginatedResponse<Package>>,
      AxiosError<ApiError>
    >({
      queryKey: ["packageUpgrades", sanitizedRequest],
      queryFn: async () => {
        const response = await authFetch.post<SearchPackagesResponse>(
          "packages:search-upgrades",
          sanitizedRequest,
        );

        return {
          ...response,
          data: mapSearchResponseToPaginatedPackages(response.data),
        };
      },
      ...config,
    });
  };

  const getInstancePackagesQuery = <
    TData = AxiosResponse<ApiPaginatedResponse<InstancePackage>>,
  >(
    { instance_id, ...params }: GetInstancePackagesParams,
    config?: Omit<
      UseQueryOptions<
        AxiosResponse<ApiPaginatedResponse<InstancePackage>>,
        AxiosError<ApiError>,
        TData
      >,
      "queryKey" | "queryFn"
    >,
  ) => {
    const searchParams = {
      ...params,
      search: params.search || undefined,
      group_by_name: true,
    };

    return useQuery<
      AxiosResponse<ApiPaginatedResponse<InstancePackage>>,
      AxiosError<ApiError>,
      TData
    >({
      queryKey: ["instancePackages", instance_id, searchParams],
      queryFn: async () => {
        const response =
          await authFetch.get<ComputerPackageSearchGroupedResponse>(
            `computers/${instance_id}/packages/search`,
            {
              params: searchParams,
            },
          );

        return {
          ...response,
          data: {
            results: response.data.results.map(
              mapGroupedResultToInstancePackage,
            ),
            count: response.data.count,
            next: null,
            previous: null,
          },
        };
      },
      ...config,
    });
  };

  const upgradePackagesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    UpgradePackagesParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("UpgradePackages", { params }),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["packages"] }),
        queryClient.invalidateQueries({ queryKey: ["packageUpgrades"] }),
        queryClient.invalidateQueries({ queryKey: ["instancePackages"] }),
      ]),
  });

  const upgradeInstancesPackagesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    UpgradeInstancePackagesParams
  >({
    mutationFn: async (params) =>
      authFetch.post("/computers/upgrade-packages", params),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["packages"] }),
        queryClient.invalidateQueries({ queryKey: ["packageUpgrades"] }),
        queryClient.invalidateQueries({ queryKey: ["instancePackages"] }),
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
      queryFn: async () =>
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
    mutationFn: async ({ instanceId, ...params }) =>
      authFetch.post(`computers/${instanceId}/packages/installed`, params),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["packages"] }),
        queryClient.invalidateQueries({ queryKey: ["packageUpgrades"] }),
        queryClient.invalidateQueries({ queryKey: ["instancePackages"] }),
      ]),
  });

  const packagesActionQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    PackagesActionParams
  >({
    mutationFn: async (params) => authFetch.post("packages", params),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["packages"] }),
        queryClient.invalidateQueries({ queryKey: ["packageUpgrades"] }),
        queryClient.invalidateQueries({ queryKey: ["instancePackages"] }),
      ]),
  });

  return {
    getPackageUpgradesQuery,
    getInstancePackagesQuery,
    upgradePackagesQuery,
    getDowngradePackageVersionsQuery,
    downgradePackageVersionQuery,
    packagesActionQuery,
    upgradeInstancesPackagesQuery,
  };
}
