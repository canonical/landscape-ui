import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  GetMirrorData,
  GetMirrorError,
  GetMirrorResponse,
} from "@canonical/landscape-openapi";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useGetMirror(
  mirrorName: GetMirrorData["path"]["name_1"],
  options: Omit<
    UseQueryOptions<
      AxiosResponse<GetMirrorResponse>,
      AxiosError<GetMirrorError>
    >,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetchDebArchive = useFetchDebArchive();

  return useSuspenseQuery<
    AxiosResponse<GetMirrorResponse>,
    AxiosError<GetMirrorError>
  >({
    queryKey: ["mirrors", mirrorName],
    queryFn: async () => authFetchDebArchive.get(mirrorName),
    ...options,
  });
}
