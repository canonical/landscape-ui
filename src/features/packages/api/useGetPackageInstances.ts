import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { AvailableVersion, PackageAction } from "../types";
import type { PackageInstance } from "../types/Package";

export interface GetPackageInstancesParams {
  id: number;
  action: PackageAction;
  selected_versions: string[];
  summary_version?: string;
  limit?: number;
  offset?: number;
  search: string;
  query?: string;
}

export interface GetDryRunInstancesParams {
  id: number;
  action: PackageAction;
  versions: string[];
  query?: string;
}

export function useGetPackageInstances({
  id,
  ...queryParams
}: GetPackageInstancesParams) {
  const authFetch = useFetch();

  return useQuery<
    AxiosResponse<ApiPaginatedResponse<PackageInstance>>,
    AxiosError<ApiError>
  >({
    queryKey: ["packages", id, queryParams],
    queryFn: async () =>
      authFetch.get(`packages/${id}/dry-run/computers`, {
        params: queryParams,
      }),
  });
}

export function useGetDryRunInstances({
  id,
  ...queryParams
}: GetDryRunInstancesParams) {
  const authFetch = useFetch();

  return useQuery<AxiosResponse<AvailableVersion[]>, AxiosError<ApiError>>({
    queryKey: ["packages", queryParams],
    queryFn: async () =>
      authFetch.get(`packages/${id}/dry-run/`, {
        params: queryParams,
      }),
  });
}
