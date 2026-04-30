import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import type {
  ListPublicationsResponse,
  Publication,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

interface UseGetPublicationsByTargetReturnType {
  publications: Publication[];
  isGettingPublications: boolean;
}

export default function useGetPublicationsByTarget(
  publicationTargetId: string | undefined,
): UseGetPublicationsByTargetReturnType {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<Publication[], AxiosError<ApiError>>({
    queryKey: ["publications", { publicationTargetId }],
    enabled: publicationTargetId !== undefined,
    queryFn: async () => {
      let pageToken: string | undefined;
      const publications: Publication[] = [];

      do {
        const response =
          await authFetchDebArchive.get<ListPublicationsResponse>(
            "publications",
            {
              params: {
                publicationTargetId,
                pageSize: 100,
                pageToken,
              },
            },
          );

        publications.push(
          ...((response.data.publications ?? []) as Publication[]),
        );
        pageToken = response.data.nextPageToken || undefined;
      } while (pageToken);

      return publications;
    },
  });

  return {
    publications: data ?? [],
    isGettingPublications: publicationTargetId !== undefined && isLoading,
  };
}
