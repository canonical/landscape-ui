import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { AxiosError, AxiosResponse } from "axios";
import { isAxiosError } from "axios";
import type {
  LocalServiceGetLocalError,
  LocalServiceGetLocalResponse,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";

const NOT_FOUND_STATUS = 404;

export const useGetLocalRepository = (localId: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isPending } = useQuery<
    AxiosResponse<LocalServiceGetLocalResponse>,
    AxiosError<LocalServiceGetLocalError>
  >({
    queryKey: ["local", localId],
    queryFn: async () => {
      try {
        const response = await authFetchDebArchive.get(`locals/${localId}`);

        if (!response.data.localId) {
          throw new Error(`Local repository ${localId} was not found`);
        }

        return response;
      } catch (caughtError) {
        if (
          isAxiosError(caughtError) &&
          caughtError.response?.status === NOT_FOUND_STATUS
        ) {
          throw new Error(`Local repository ${localId} was not found`);
        }

        throw caughtError;
      }
    },
    enabled: !!localId,
    throwOnError: true,
  });

  return {
    repository: data?.data,
    isGettingRepository: isPending,
  };
};
