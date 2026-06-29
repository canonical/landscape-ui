import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  PublicationTargetServiceListPublicationTargetsError,
  PublicationTargetServiceListPublicationTargetsData,
  ListPublicationTargetsResponse,
  PublicationTarget,
} from "@canonical/landscape-openapi";

export default function useGetPublicationTargets(
  options?: PublicationTargetServiceListPublicationTargetsData["query"],
) {
  const { pageSize, filter } = options ?? {};
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<
    PublicationTarget[],
    AxiosError<PublicationTargetServiceListPublicationTargetsError>
  >({
    queryKey: ["publication-targets", options ?? "all"],
    queryFn: async () => {
      let pageToken: string | undefined;
      const targets: PublicationTarget[] = [];

      do {
        const response =
          await authFetchDebArchive.get<ListPublicationTargetsResponse>(
            "publicationTargets",
            {
              params: {
                pageSize: pageSize ?? 1000,
                pageToken,
                filter: filter ? `display_name="${filter}*"` : undefined,
              },
            },
          );

        targets.push(...(response.data.publicationTargets ?? []));
        pageToken = !pageSize ? response.data.nextPageToken : undefined;
      } while (pageToken);

      return targets;
    },
  });

  return {
    publicationTargets: data ?? [],
    isGettingPublicationTargets: isLoading,
    count: data?.length ?? 0,
  };
}
