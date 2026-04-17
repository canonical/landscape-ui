import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface GetRepositoryPackagesParams {
  repository: string,
  page_size?: number,
  page_token?: string,
}

interface GetRepositoryPackagesResponse {
  local_packages: string[],
  next_page_token: string,
}

export const useGetRepositoryPackages = (
  { repository, ...params }: GetRepositoryPackagesParams,
  options?: Omit<
    UseQueryOptions<AxiosResponse<GetRepositoryPackagesResponse>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  >,
) => {
  const authFetch = useFetch();

  const { data: response, isPending } = useQuery<
    AxiosResponse<GetRepositoryPackagesResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["locals", repository, params],
    queryFn: async () => authFetch.get(`locals/${repository}/packages`, { params }),
    ...options,
  });

  return {
    result: response?.data,
    isGettingRepoPackages: isPending,
  };
};
