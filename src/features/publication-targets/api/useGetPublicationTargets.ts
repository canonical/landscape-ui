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
}

export default function useGetPublicationTargets(
  options?: UseGetPublicationTargetsOptions,
) {
  const { pageSize } = options ?? {};
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<
    PublicationTarget[],
    AxiosError<ApiError>
  >({
    queryKey: ["publication-targets", pageSize ?? "all"],
    queryFn: async () => {
      if (pageSize !== undefined) {
        const response =
          await authFetchDebArchive.get<ListPublicationTargetsResponse>(
            "publicationTargets",
            { params: { pageSize } },
          );
        return response.data.publicationTargets ?? [];
      }

      let pageToken: string | undefined;
      const targets: PublicationTarget[] = [];

      do {
        const response =
          await authFetchDebArchive.get<ListPublicationTargetsResponse>(
            "publicationTargets",
            { params: { pageSize: 1000, pageToken } },
          );

        targets.push(...(response.data.publicationTargets ?? []));
        pageToken = response.data.nextPageToken || undefined;
      } while (pageToken);

      return targets;
    },
  });

  return {
    publicationTargets: data ?? [],
    isGettingPublicationTargets: isLoading,
  };
}
