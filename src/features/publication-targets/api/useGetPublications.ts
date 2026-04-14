import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  ListPublicationsResponse,
  Publication,
} from "@/api/generated/debArchive.schemas";

export default function useGetPublications() {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<Publication[], AxiosError<ApiError>>({
    queryKey: ["publication-targets", "publications", "all"],
    queryFn: async () => {
      let pageToken: string | undefined;
      const publications: Publication[] = [];

      do {
        const response =
          await authFetchDebArchive.get<ListPublicationsResponse>(
            "publications",
            { params: { pageSize: 100, pageToken } },
          );

        publications.push(...(response.data.publications ?? []));
        pageToken = response.data.nextPageToken || undefined;
      } while (pageToken);

      return publications;
    },
  });

  return {
    publications: data ?? [],
    isGettingPublications: isLoading,
  };
}
