import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import type { Publication } from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

interface ListPublicationsResponse {
  publications: Publication[];
  next_page_token?: string;
}

const useGetPublicationsBySource = (source?: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<Publication[], AxiosError<ApiError>>({
    queryKey: ["publications", source],
    enabled: !!source,
    queryFn: async () => {
      let page_token: string | undefined;
      const publications: Publication[] = [];

      do {
        const response =
          await authFetchDebArchive.get<ListPublicationsResponse>(
            "publications",
            {
              params: {
                filter: `source="${source}"`,
                page_size: 1000,
                page_token,
              },
            },
          );

        publications.push(...(response.data.publications ?? []));
        page_token = response.data.next_page_token;
      } while (page_token);

      return publications;
    },
  });

  return {
    publications: data ?? [],
    isGettingPublications: isLoading,
  };
};

export default useGetPublicationsBySource;
