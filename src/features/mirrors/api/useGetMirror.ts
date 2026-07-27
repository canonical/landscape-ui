import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  MirrorServiceGetMirrorError,
  MirrorServiceGetMirrorResponse,
} from "@canonical/landscape-openapi";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
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

  return useSuspenseQuery<
    AxiosResponse<MirrorServiceGetMirrorResponse>,
    AxiosError<MirrorServiceGetMirrorError>
  >({
    queryKey: ["mirror", mirrorName],
    queryFn: async () => {
      try {
        const response = await authFetchDebArchive.get(mirrorName);

        return response;
      } catch (error) {
        if (
          isAxiosError(error) &&
          error.response?.status === NOT_FOUND_STATUS
        ) {
          throw new Error(`Mirror ${mirrorName} was not found`);
        }

        throw error;
      }
    },
    ...options,
  });
}
