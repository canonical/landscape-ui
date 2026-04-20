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

const FETCH_PAGE_SIZE = 1000;

const useGetPublications = (): UseGetPublicationsReturnType => {
  const authFetchDebArchive = useFetchDebArchive();
  const { currentPage, pageSize, search } = usePageParams();

  const { data, isLoading } = useQuery<Publication[], AxiosError<ApiError>>({
    queryKey: ["publications", "all"],
    queryFn: async () => {
      const response = await authFetchDebArchive.get<ListPublicationsResponse>(
        "publications",
        {
          params: {
            pageSize: FETCH_PAGE_SIZE,
          },
        },
      );

      return response.data.publications ?? [];
    },
  });

  const filteredPublications = useMemo(() => {
    const normalizedSearch = search?.trim().toLowerCase();

    if (!normalizedSearch) {
      return data ?? [];
    }

    return (data ?? []).filter((publication) =>
      publication.name.toLowerCase().includes(normalizedSearch),
    );
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
