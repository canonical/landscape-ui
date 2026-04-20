import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
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
) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data: response, isPending } = useQuery<
    AxiosResponse<GetRepositoryPackagesResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["packages", repository, params],
    queryFn: async () => authFetchDebArchive.get(`${repository}/packages`, { params }),
  });

  return {
    result: response?.data,
    isGettingRepositoryPackages: isPending,
  };
};
