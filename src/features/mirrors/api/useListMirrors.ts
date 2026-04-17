import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import type {
  ListMirrorsData,
  ListMirrorsResponse,
} from "@canonical/landscape-openapi";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useListMirrors(
  params: ListMirrorsData["query"],
  options: Omit<
    UseQueryOptions<AxiosResponse<ListMirrorsResponse>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetchDebArchive = useFetchDebArchive();

  return useSuspenseQuery<
    AxiosResponse<ListMirrorsResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["mirrors", params],
    queryFn: async () => authFetchDebArchive.get("mirrors"),
    ...options,
  });
}
