import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  MirrorServiceGetMirrorError,
  MirrorServiceGetMirrorResponse,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { rethrowWithNotFoundMessage } from "@/utils/queryErrors";

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
        return rethrowWithNotFoundMessage(
          caughtError,
          `Mirror ${mirrorName} was not found`,
        );
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
