import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { LocalRepository } from "../types";

export const useGetLocalRepository = (name: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data: response, isPending, error } = useQuery<
    AxiosResponse<LocalRepository>,
    AxiosError<ApiError>
  >({
    queryKey: ["local", name],
    queryFn: async () => authFetchDebArchive.get(name),
  });

  return {
    repository: response?.data,
    repositoryError:
      response && !response.data
        ? new Error(`The local repository "${name}" could not be found.`)
        : error,
    isGettingRepository: isPending,
  };
};
