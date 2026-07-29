import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  MirrorServiceGetMirrorError,
  MirrorServiceGetMirrorResponse,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import type { AxiosError, AxiosResponse } from "axios";

const NOT_FOUND_STATUS = 404;
type GetMirrorError = AxiosError<MirrorServiceGetMirrorError> | Error;

export function useGetMirror(mirrorName: string) {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isPending } = useQuery<
    AxiosResponse<MirrorServiceGetMirrorResponse>,
    GetMirrorError
  >({
    queryKey: ["mirror", mirrorName],
    queryFn: async () => {
      try {
        const response = await authFetchDebArchive.get(mirrorName);
        if (!response.data?.mirrorId) {
          throw new Error(`Mirror ${mirrorName} was not found`);
        }

        return response;
      } catch (caughtError) {
        if (
          isAxiosError(caughtError) &&
          caughtError.response?.status === NOT_FOUND_STATUS
        ) {
          throw new Error(`Mirror ${mirrorName} was not found`);
        }

        throw caughtError;
      }
    },
    enabled: !!mirrorName,
    throwOnError: true,
  });

  return {
    mirror: data?.data,
    isGettingMirror: !!mirrorName && isPending,
  };
}
