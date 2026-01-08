import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { PackageInstance } from "../types/Package";
import type {
  PackageAction,
  PackageVersionsInstanceCount,
  SelectedPackage,
} from "../types";

interface GetPackageInstancesParams {
  id: number;
  action: PackageAction;
  selected_versions: string[];
  summary_version?: string;
  limit?: number;
  offset?: number;
  search: string;
  query: string;
}

interface GetDryRunInstancesParams {
  action: PackageAction;
  packages: SelectedPackage[];
  query: string;
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
      authFetch.get(`packages/dry-run/${id}/computers`, {
        params: queryParams,
      }),
  });
}

export function useGetDryRunInstances({
  ...queryParams
}: GetDryRunInstancesParams) {
  const authFetch = useFetch();

  return useQuery<
    AxiosResponse<PackageVersionsInstanceCount[]>,
    AxiosError<ApiError>
  >({
    queryKey: ["packages", queryParams],
    queryFn: async () =>
      authFetch.get(`packages/dry-run`, {
        params: queryParams,
      }),
  });
}
