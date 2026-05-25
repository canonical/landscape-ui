import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  GetLocalError,
  GetLocalResponse,
} from "@canonical/landscape-openapi";

export const useGetLocalRepository = (name: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const {
    data: response,
    isPending,
    error,
  } = useQuery<AxiosResponse<GetLocalResponse>, AxiosError<GetLocalError>>({
    queryKey: ["local", name],
    queryFn: async () => authFetchDebArchive.get(name),
  });

  return {
    repository: response?.data,
    repositoryError:
      response && !response.data
        ? new Error("The local repository could not be found.")
        : error,
    isGettingRepository: isPending,
  };
};
