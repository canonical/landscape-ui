import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  ListMirrorsData,
  ListMirrorsError,
  ListMirrorsResponse,
} from "@canonical/landscape-openapi";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useListMirrors(
  params: ListMirrorsData["query"] = {},
  options: Omit<
    UseQueryOptions<
      AxiosResponse<ListMirrorsResponse>,
      AxiosError<ListMirrorsError>
    >,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetchDebArchive = useFetchDebArchive();

  return useSuspenseQuery<
    AxiosResponse<ListMirrorsResponse>,
    AxiosError<ListMirrorsError>
  >({
    queryKey: ["mirrors", params],
    queryFn: async () => authFetchDebArchive.get("mirrors", { params }),
    ...options,
  });
}
