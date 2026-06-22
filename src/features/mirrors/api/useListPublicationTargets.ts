import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  PublicationTargetServiceListPublicationTargetsData,
  PublicationTargetServiceListPublicationTargetsError,
  ListPublicationTargetsResponse,
} from "@canonical/landscape-openapi";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useListPublicationTargets(
  params: PublicationTargetServiceListPublicationTargetsData["query"] = {},
  options: Omit<
    UseQueryOptions<
      AxiosResponse<ListPublicationTargetsResponse>,
      AxiosError<PublicationTargetServiceListPublicationTargetsError>
    >,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetchDebArchive = useFetchDebArchive();

  return useSuspenseQuery<
    AxiosResponse<ListPublicationTargetsResponse>,
    AxiosError<PublicationTargetServiceListPublicationTargetsError>
  >({
    queryKey: ["publicationTargets", params],
    queryFn: async () =>
      authFetchDebArchive.get("publicationTargets", { params }),
    ...options,
  });
}
