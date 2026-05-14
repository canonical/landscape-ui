import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  Publication,
  ListPublicationsError,
  ListPublicationsResponse,
} from "@canonical/landscape-openapi";

export const useGetPublicationsBySource = (source?: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<
    Publication[],
    AxiosError<ListPublicationsError>
  >({
    queryKey: ["publications", source],
    enabled: !!source,
    queryFn: async () => {
      let pageToken: string | undefined;
      const publications: Publication[] = [];

      do {
        const response =
          await authFetchDebArchive.get<ListPublicationsResponse>(
            "publications",
            {
              params: {
                filter: `source="${source}"`,
                pageSize: 1000,
                pageToken,
              },
            },
          );

        publications.push(...(response.data.publications ?? []));
        pageToken = response.data.nextPageToken;
      } while (pageToken);

      return publications;
    },
  });

  return {
    publications: data ?? [],
    isGettingPublications: isLoading,
  };
};
