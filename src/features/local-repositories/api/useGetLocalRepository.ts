import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { rethrowWithNotFoundMessage } from "@/utils/queryErrors";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  LocalServiceGetLocalError,
  LocalServiceGetLocalResponse,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";

type GetLocalRepositoryError = AxiosError<LocalServiceGetLocalError> | Error;

export const useGetLocalRepository = (localId: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isPending } = useQuery<
    AxiosResponse<LocalServiceGetLocalResponse>,
    GetLocalRepositoryError
  >({
    queryKey: ["local", localId],
    queryFn: async () => {
      try {
        const response = await authFetchDebArchive.get(`locals/${localId}`);

        if (!response.data?.localId) {
          throw new Error(`Local repository ${localId} was not found`);
        }

        return response;
      } catch (caughtError) {
        return rethrowWithNotFoundMessage(
          caughtError,
          `Local repository ${localId} was not found`,
        );
      }
    },
    enabled: !!localId,
    throwOnError: true,
  });

  return {
    repository: data?.data,
    isGettingRepository: !!localId && isPending,
  };
};
