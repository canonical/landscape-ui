import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  ListPublicationTargetsResponse,
  PublicationTarget,
} from "@canonical/landscape-openapi";

interface UseGetPublicationTargetsOptions {
  pageSize?: number;
  search?: string;
}

export default function useGetPublicationTargets(
  options?: UseGetPublicationTargetsOptions,
) {
  const { pageSize, search } = options ?? {};
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<
    PublicationTarget[],
    AxiosError<ApiError>
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
                filter: search ? `display_name="${search}*"` : undefined,
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
