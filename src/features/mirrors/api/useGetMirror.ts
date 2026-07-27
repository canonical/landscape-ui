import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  MirrorServiceGetMirrorError,
  MirrorServiceGetMirrorResponse,
} from "@canonical/landscape-openapi";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import type { AxiosError, AxiosResponse } from "axios";

const NOT_FOUND_STATUS = 404;

export function useGetMirror(
  mirrorName: string,
  options: Omit<
    UseQueryOptions<
      AxiosResponse<MirrorServiceGetMirrorResponse>,
      AxiosError<MirrorServiceGetMirrorError>
    >,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isPending } = useQuery<
    AxiosResponse<MirrorServiceGetMirrorResponse>,
    AxiosError<MirrorServiceGetMirrorError>
  >({
    queryKey: ["mirror", mirrorName],
    queryFn: async () => {
      try {
        const response = await authFetchDebArchive.get(mirrorName);

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
    ...options,
  });

  return {
    mirror: data?.data,
    isGettingMirror: !!mirrorName && isPending,
  };
}
