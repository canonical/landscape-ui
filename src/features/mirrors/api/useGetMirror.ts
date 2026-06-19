import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  MirrorServiceGetMirrorError,
  MirrorServiceGetMirrorResponse,
} from "@canonical/landscape-openapi";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

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
    queryFn: async () => authFetchDebArchive.get(mirrorName),
    ...options,
  });
}
