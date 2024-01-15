import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useFetchOld from "./useFetchOld";
import { QueryFnType } from "../types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "../types/ApiError";
import { Package } from "../types/Package";
import useDebug from "./useDebug";

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

interface InstallPackagesParams {
  query: string;
  packages: string[];
  deliver_after?: string;
  deliver_delay_window?: number;
}

interface RemovePackagesParams {
  query: string;
  packages: string[];
  deliver_after?: string;
  deliver_delay_window?: number;
}

interface UpgradePackagesParams {
  query: string;
  packages: string[];
  security_only?: boolean;
  deliver_after?: string;
  deliver_delay_window?: number;
}

export const usePackages = () => {
  const queryClient = useQueryClient();
  const authFetch = useFetchOld();
  const debug = useDebug();

  const getPackagesQuery: QueryFnType<
    AxiosResponse<Package[]>,
    GetPackagesParams
  > = (queryParams, config = {}) => {
    return useQuery<AxiosResponse<Package[]>, AxiosError<ApiError>>({
      queryKey: ["packages", { ...queryParams }],
      queryFn: () =>
        authFetch!.get("GetPackages", {
          params: queryParams,
        }),
      ...config,
    });
  };

  const installPackagesQuery = useMutation<
    AxiosResponse<unknown>,
    AxiosError<ApiError>,
    InstallPackagesParams
  >({
    mutationKey: ["packages", "install"],
    mutationFn: (params) => authFetch!.get("InstallPackages", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["packages"]).catch(debug);
    },
  });

  const removePackagesQuery = useMutation<
    AxiosResponse<unknown>,
    AxiosError<ApiError>,
    RemovePackagesParams
  >({
    mutationKey: ["packages", "install"],
    mutationFn: (params) => authFetch!.get("RemovePackages", { params }),
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
    mutationFn: (params) => authFetch!.get("UpgradePackages", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["packages"]).catch(debug);
    },
  });

  return {
    getPackagesQuery,
    installPackagesQuery,
    removePackagesQuery,
    upgradePackagesQuery,
  };
};
