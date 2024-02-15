import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import useFetchOld from "./useFetchOld";
import { QueryFnType } from "../types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "../types/ApiError";
import { Package } from "../types/Package";
import useDebug from "./useDebug";
import useFetch from "./useFetch";
import { ApiPaginatedResponse } from "../types/ApiPaginatedResponse";

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

interface GetComputerPackagesParams {
  computer_id: number;
  available?: boolean;
  held?: boolean;
  installed?: boolean;
  limit?: number;
  names?: string[];
  offset?: number;
  search?: string;
  upgrade?: boolean;
}

export interface CommonPackagesActionParams {
  packages: string[];
  query: string;
  deliver_after?: string;
  deliver_delay_window?: number;
}

interface UpgradePackagesParams extends CommonPackagesActionParams {
  security_only?: boolean;
}

export const usePackages = () => {
  const queryClient = useQueryClient();
  const authFetchOld = useFetchOld();
  const authFetch = useFetch();
  const debug = useDebug();

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
        authFetch!.get("packages", {
          params: queryParams,
        }),
      ...config,
    });
  };

  const getComputerPackagesQuery = (
    { computer_id, ...queryParams }: GetComputerPackagesParams,
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
      queryKey: ["packages", queryParams],
      queryFn: () =>
        authFetch!.get(`computers/${computer_id}/packages`, {
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

  return {
    getPackagesQuery,
    getComputerPackagesQuery,
    installPackagesQuery,
    removePackagesQuery,
    upgradePackagesQuery,
  };
};
