import type { Publication } from "../types";
import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import usePageParams from "@/hooks/usePageParams";
import type { ApiError } from "@/types/api/ApiError";
import type { ListPublicationsResponse } from "../types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useMemo } from "react";
import {
  getPublicationTargetName,
  getSourceName,
  getSourceType,
} from "../helpers";

interface UseGetPublicationsReturnType {
  publications: Publication[];
  publicationsCount: number;
  isGettingPublications: boolean;
}

const FETCH_PAGE_SIZE = 1000;

const SEARCH_PREFIXES = [
  "publicationTarget:",
  "source:",
  "sourceType:",
] as const;
type SearchPrefix = (typeof SEARCH_PREFIXES)[number];

const parseSearchQuery = (
  search: string,
):
  | { prefix: SearchPrefix; value: string }
  | { prefix: null; value: string } => {
  for (const prefix of SEARCH_PREFIXES) {
    if (search.startsWith(prefix)) {
      return {
        prefix,
        value: search.slice(prefix.length).trim().toLowerCase(),
      };
    }
  }
  return { prefix: null, value: search.trim().toLowerCase() };
};

const matchesSearch = (
  publication: Publication,
  prefix: SearchPrefix | null,
  value: string,
): boolean => {
  if (!value) return true;
  switch (prefix) {
    case "publicationTarget:":
      return (getPublicationTargetName(publication.publicationTarget) ?? "")
        .toLowerCase()
        .includes(value);
    case "source:":
      return (getSourceName(publication.source) ?? "")
        .toLowerCase()
        .includes(value);
    case "sourceType:":
      return getSourceType(publication.source).toLowerCase().includes(value);
    default:
      return publication.label.toLowerCase().includes(value);
  }
};

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
    const normalizedSearch = search?.trim() ?? "";

    if (!normalizedSearch) {
      return data ?? [];
    }

    const { prefix, value } = parseSearchQuery(normalizedSearch);

    return (data ?? []).filter((publication) =>
      matchesSearch(publication, prefix, value),
    );
  }, [data, search]);

  const paginatedPublications = useMemo(() => {
    const offset = (currentPage - 1) * pageSize;

    return filteredPublications.slice(offset, offset + pageSize);
  }, [currentPage, filteredPublications, pageSize]);

  return {
    publications: paginatedPublications,
    publicationsCount: data?.length ?? 0,
    isGettingPublications: isLoading,
  };
};

export default useGetPublications;
