import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  MirrorServiceListMirrorsData,
  MirrorServiceListMirrorsError,
  MirrorServiceListMirrorsResponse,
} from "@canonical/landscape-openapi";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useListMirrors(
  params: MirrorServiceListMirrorsData["query"] = {},
  options: Omit<
    UseQueryOptions<
      AxiosResponse<MirrorServiceListMirrorsResponse>,
      AxiosError<MirrorServiceListMirrorsError>
    >,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetchDebArchive = useFetchDebArchive();

  return useSuspenseQuery<
    AxiosResponse<MirrorServiceListMirrorsResponse>,
    AxiosError<MirrorServiceListMirrorsError>
  >({
    queryKey: ["mirrors", params],
    queryFn: async () => authFetchDebArchive.get("mirrors", { params }),
    ...options,
  });
}
