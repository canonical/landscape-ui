import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { LocalRepository } from "../types";

interface GetLocalRepositoriesParams {
  page_size?: number,
  page_token?: string,
  filter?: string,
}

interface GetLocalRepositoriesResponse {
  locals: LocalRepository[],
  next_page_token: string,
}

export const useGetLocalRepositories = (params?: GetLocalRepositoriesParams) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data: response, isPending } = useQuery<
    AxiosResponse<GetLocalRepositoriesResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["locals", params],
    queryFn: async () => authFetchDebArchive.get("locals", { params }),
  });

  return {
    result: response?.data,
    isGettingLocalRepositories: isPending,
  };
};
