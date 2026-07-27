import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  LocalServiceGetLocalError,
  LocalServiceGetLocalResponse,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";

export const useGetLocalRepository = (localId: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, error, isLoading } = useQuery<
    AxiosResponse<LocalServiceGetLocalResponse>,
    AxiosError<LocalServiceGetLocalError>
  >({
    queryKey: ["local", localId],
    queryFn: async () => authFetchDebArchive.get(`locals/${localId}`),
    enabled: !!localId,
  });

  const repository = data?.data.localId ? data.data : undefined;
  const repositoryError =
    error ??
    (data && !data.data.localId
      ? new Error(`Local repository ${localId} was not found`)
      : undefined);

  return {
    repository,
    repositoryError,
    isGettingRepository: isLoading,
  };
};
