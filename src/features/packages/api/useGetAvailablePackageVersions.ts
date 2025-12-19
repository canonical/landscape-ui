import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface GetAvailablePackageVersionsParams {
  id: number;
  query: string;
}

export function useGetAvailablePackageVersions({
  id,
  ...queryParams
}: GetAvailablePackageVersionsParams) {
  const authFetch = useFetch();

  return useQuery<
    AxiosResponse<
      {
        name: string;
        num_computers: number;
      }[]
    >,
    AxiosError<ApiError>
  >({
    queryKey: ["packages", id, queryParams],
    queryFn: async () =>
      authFetch.get(`packages/${id}/available_versions`, {
        params: queryParams,
      }),
  });
}
