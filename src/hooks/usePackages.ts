import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import useFetchOld from "./useFetchOld";
import { QueryFnType } from "@/types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "@/types/ApiError";
import { OldPackage, Package } from "@/types/Package";
import useDebug from "./useDebug";
import useFetch from "./useFetch";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { Activity } from "@/features/activities";

interface GetPackagesParams {
  query: string;
  available?: boolean;
  held?: boolean;
  installed?: boolean;
  limit?: number;
  names?: string[];
  offset?: number;
  search?: string;
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
  upgrade?: boolean;
  security?: boolean;
}

export interface CommonPackagesActionParams {
  query: string;
  packages?: string[];
  deliver_after?: string;
  deliver_delay_window?: number;
}

interface UpgradePackagesParams extends CommonPackagesActionParams {
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

export const usePackages = () => {
  const queryClient = useQueryClient();
  const authFetchOld = useFetchOld();
  const authFetch = useFetch();
  const debug = useDebug();

  const getPackagesQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<OldPackage>>,
    GetPackagesParams
  > = (queryParams, config = {}) => {
    return useQuery<
      AxiosResponse<ApiPaginatedResponse<OldPackage>>,
      AxiosError<ApiError>
    >({
      queryKey: ["packages", queryParams],
      queryFn: () =>
        authFetch!.get("packages", {
          params: queryParams,
        }),
      ...config,
    });
  };

  const getInstancePackagesQuery = (
    { instance_id, ...queryParams }: GetInstancePackagesParams,
    config: Omit<
      UseQueryOptions<
        AxiosResponse<ApiPaginatedResponse<Package>>,
        AxiosError<ApiError>
      >,
      "queryKey" | "queryFn"
    > = {},
  ) => {
    return useQuery<
      AxiosResponse<ApiPaginatedResponse<Package>>,
      AxiosError<ApiError>
    >({
      queryKey: ["packages", { instance_id, ...queryParams }],
      queryFn: () =>
        authFetch!.get(`computers/${instance_id}/packages`, {
          params: queryParams,
        }),
      ...config,
    });
  };

  const installPackagesQuery = useMutation<
    AxiosResponse<unknown>,
    AxiosError<ApiError>,
    CommonPackagesActionParams
  >({
    mutationKey: ["packages", "install"],
    mutationFn: (params) => authFetchOld!.get("InstallPackages", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["packages"]).catch(debug);
    },
  });

  const removePackagesQuery = useMutation<
    AxiosResponse<unknown>,
    AxiosError<ApiError>,
    CommonPackagesActionParams
  >({
    mutationKey: ["packages", "install"],
    mutationFn: (params) => authFetchOld!.get("RemovePackages", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["packages"]).catch(debug);
    },
  });

  const upgradePackagesQuery = useMutation<
    AxiosResponse<unknown>,
    AxiosError<ApiError>,
    UpgradePackagesParams
  >({
    mutationKey: ["packages", "upgrade"],
    mutationFn: (params) => authFetchOld!.get("UpgradePackages", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["packages"]).catch(debug);
    },
  });

  const getDowngradePackageVersionsQuery = (
    { instanceId, packageName }: GetDowngradePackageVersionsParams,
    config: Omit<
      UseQueryOptions<
        AxiosResponse<
          ApiPaginatedResponse<Pick<OldPackage, "name" | "summary" | "version">>
        >,
        AxiosError<ApiError>
      >,
      "queryKey" | "queryFn"
    > = {},
  ) =>
    useQuery<
      AxiosResponse<
        ApiPaginatedResponse<Pick<OldPackage, "name" | "summary" | "version">>
      >,
      AxiosError<ApiError>
    >({
      queryKey: ["packages", { instanceId, packageName }],
      queryFn: () =>
        authFetch!.get(
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
      authFetch!.post(`computers/${instanceId}/packages/installed`, params),
    onSuccess: () => {
      queryClient.invalidateQueries(["packages"]).catch(debug);
    },
  });

  return {
    getPackagesQuery,
    getInstancePackagesQuery,
    installPackagesQuery,
    removePackagesQuery,
    upgradePackagesQuery,
    getDowngradePackageVersionsQuery,
    downgradePackageVersionQuery,
  };
};
