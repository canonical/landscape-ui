import type { Publication } from "../types";
import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import usePageParams from "@/hooks/usePageParams";
import type { ApiError } from "@/types/api/ApiError";
import type { ListPublicationsResponse } from "../types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useMemo } from "react";

interface UseGetPublicationsReturnType {
  publications: Publication[];
  publicationsCount: number;
  isGettingPublications: boolean;
}

const useGetPublications = (): UseGetPublicationsReturnType => {
  const authFetchDebArchive = useFetchDebArchive();
  const { currentPage, pageSize, search } = usePageParams();

  const { data, isLoading } = useQuery<Publication[], AxiosError<ApiError>>({
    queryKey: ["publications", "all"],
    queryFn: async () => {
      let pageToken: string | undefined;
      const publications: Publication[] = [];

      do {
        const response =
          await authFetchDebArchive.get<ListPublicationsResponse>(
            "publications",
            {
              params: {
                pageSize,
                pageToken,
              },
            },
          );

        publications.push(...(response.data.publications ?? []));
        pageToken = response.data.nextPageToken || undefined;
      } while (pageToken);

      return publications;
    },
  });

  const filteredPublications = useMemo(() => {
    const normalizedSearch = search?.trim().toLowerCase();

    if (!normalizedSearch) {
      return data ?? [];
    }

    return (data ?? []).filter((publication) => {
      const searchFields = [
        publication.name,
        publication.publicationId,
        publication.publicationTarget,
        publication.mirror,
        publication.distribution,
        publication.component,
      ];

      return searchFields.some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      );
    });
  }, [data, search]);

  const paginatedPublications = useMemo(() => {
    const offset = (currentPage - 1) * pageSize;

    return filteredPublications.slice(offset, offset + pageSize);
  }, [currentPage, filteredPublications, pageSize]);

  return {
    publications: paginatedPublications,
    publicationsCount: filteredPublications.length,
    isGettingPublications: isLoading,
  };
};

export default useGetPublications;
