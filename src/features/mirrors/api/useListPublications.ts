import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import type {
  ListPublicationsData,
  ListPublicationsResponse,
} from "@canonical/landscape-openapi";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useListPublications(
  params: ListPublicationsData["query"],
  options: Omit<
    UseQueryOptions<
      AxiosResponse<ListPublicationsResponse>,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetchDebArchive = useFetchDebArchive();

  return useSuspenseQuery<
    AxiosResponse<ListPublicationsResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["publications", params],
    queryFn: async () => authFetchDebArchive.get("publications"),
    ...options,
  });
}
