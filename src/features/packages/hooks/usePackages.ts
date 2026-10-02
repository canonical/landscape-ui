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
  ComputerPackageSearchGroupedResult,
  ComputerPackageSearchParams,
  DowngradePackageVersion,
  InstancePackage,
  Package,
  PackageInstallationCandidate,
  SearchPackagesRequest,
  SearchPackagesResponse,
  SearchUpgradesRequest,
} from "../types";

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

const SYNTHETIC_ID_PREFIX = -900000;

let syntheticIdCounter = 0;

const getSyntheticId = (): number => {
  syntheticIdCounter -= 1;

  return SYNTHETIC_ID_PREFIX + syntheticIdCounter;
};

const pickAvailableCandidate = (
  candidates: PackageInstallationCandidate[],
): PackageInstallationCandidate | undefined => {
  const securityCandidate = candidates.find(({ security }) => security);

  if (securityCandidate) {
    return securityCandidate;
  }

  return candidates.find(({ upgrade }) => upgrade);
};

const resolvePackageStatus = (
  result: ComputerPackageSearchGroupedResult,
  candidate?: PackageInstallationCandidate,
): "available" | "installed" | "held" | "security" => {
  if (result.held) {
    return "held";
  }

  if (candidate?.security) {
    return "security";
  }

  if (result.installed_version) {
    return "installed";
  }

  if (candidate) {
    return "available";
  }

  return "installed";
};

export const mapGroupedResultToInstancePackage = (
  result: ComputerPackageSearchGroupedResult,
): InstancePackage => {
  const candidate = pickAvailableCandidate(result.installation_candidates);

  return {
    id: result.installed_id ?? candidate?.id ?? getSyntheticId(),
    name: result.name,
    summary: result.summary ?? "",
    current_version: result.installed_version,
    available_version: candidate?.version ?? null,
    status: resolvePackageStatus(result, candidate),
  };
};

const sanitizeFilterState = (state?: FilterState): FilterState | undefined => {
  if (!state || state === FilterState.UNSPECIFIED) {
    return undefined;
  }

  return state;
};

const sanitizeSearchPackagesRequest = (
  request?: SearchPackagesRequest,
): SearchPackagesRequest => {
  const names = request?.names?.length ? request.names : undefined;
  const text = request?.text || undefined;

  return {
    computer_query: request?.computer_query ?? "",
    text,
    names,
    installed: sanitizeFilterState(request?.installed),
    available: sanitizeFilterState(request?.available),
    upgrade: sanitizeFilterState(request?.upgrade),
    held: sanitizeFilterState(request?.held),
    security: sanitizeFilterState(request?.security),
    limit: request?.limit,
    offset: request?.offset,
  };
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

  const getPackagesQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<Package>>,
    SearchPackagesRequest
  > = (request, config = {}) => {
    const sanitizedRequest = sanitizeSearchPackagesRequest(request);

    return useQuery<
      AxiosResponse<ApiPaginatedResponse<Package>>,
      AxiosError<ApiError>
    >({
      queryKey: ["packages", sanitizedRequest],
      queryFn: async () => {
        const response = await authFetch.post<SearchPackagesResponse>(
          "packages:search",
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
    getPackagesQuery,
    getPackageUpgradesQuery,
    getInstancePackagesQuery,
    upgradePackagesQuery,
    getDowngradePackageVersionsQuery,
    downgradePackageVersionQuery,
    packagesActionQuery,
    upgradeInstancesPackagesQuery,
  };
}
