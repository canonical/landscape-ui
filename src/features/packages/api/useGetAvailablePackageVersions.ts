import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { AvailableVersion } from "../types/AvailableVersion";
import type { PackageAction } from "../types";

interface GetAvailablePackageVersionsParams {
  id: number;
  action: PackageAction;
  query: string;
}

export function useGetAvailablePackageVersions({
  id,
  ...queryParams
}: GetAvailablePackageVersionsParams) {
  const authFetch = useFetch();

  return useQuery<
    AxiosResponse<{ without_version: number; versions: AvailableVersion[] }>,
    AxiosError<ApiError>
  >({
    queryKey: ["packages", id, queryParams],
    queryFn: async () =>
      authFetch.get(`packages/${id}/available_versions`, {
        params: queryParams,
      }),
  });
}
