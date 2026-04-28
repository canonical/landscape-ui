import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  ListPublicationTargetsData,
  ListPublicationTargetsError,
  ListPublicationTargetsResponse,
} from "@canonical/landscape-openapi";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useListPublicationTargets(
  params: ListPublicationTargetsData["query"] = {},
  options: Omit<
    UseQueryOptions<
      AxiosResponse<ListPublicationTargetsResponse>,
      AxiosError<ListPublicationTargetsError>
    >,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetchDebArchive = useFetchDebArchive();

  return useSuspenseQuery<
    AxiosResponse<ListPublicationTargetsResponse>,
    AxiosError<ListPublicationTargetsError>
  >({
    queryKey: ["publicationTargets", params],
    queryFn: async () =>
      authFetchDebArchive.get("publicationTargets", { params }),
    ...options,
  });
}
