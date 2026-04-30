import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import usePageParams from "@/hooks/usePageParams";
import type { ApiError } from "@/types/api/ApiError";
import type {
  ListPublicationsResponse,
  Publication,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useMemo } from "react";

const PUBLICATION_TARGET_ID_PREFIX = "publicationTargetId:";
const SOURCE_PREFIX = "source:";

const buildFilter = (query: string | undefined): string | undefined => {
  const trimmed = query?.trim() ?? "";
  if (!trimmed) return undefined;

  if (trimmed.startsWith(PUBLICATION_TARGET_ID_PREFIX)) {
    const id = trimmed.slice(PUBLICATION_TARGET_ID_PREFIX.length).trim();
    if (id) return `publication_target="publicationTargets/${id}"`;
  }

  if (trimmed.startsWith(SOURCE_PREFIX)) {
    const source = trimmed.slice(SOURCE_PREFIX.length).trim();
    if (source) return `source="${source}"`;
  }

  return `display_name="${trimmed}*"`;
};

export const useGetPublications = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const { currentPage, pageSize, query } = usePageParams();

  const filter = buildFilter(query);

  const { data, isLoading } = useQuery<Publication[], AxiosError<ApiError>>({
    queryKey: ["publications", "all", filter],
    queryFn: async () => {
      let pageToken: string | undefined;
      const allPublications: Publication[] = [];

      do {
        const response =
          await authFetchDebArchive.get<ListPublicationsResponse>(
            "publications",
            {
              params: {
                pageSize: 1000,
                ...(pageToken ? { pageToken } : {}),
                ...(filter ? { filter } : {}),
              },
            },
          );

        allPublications.push(...(response.data.publications ?? []));
        pageToken = response.data.nextPageToken || undefined;
      } while (pageToken);

      return allPublications;
    },
  });

  const paginatedPublications = useMemo(() => {
    const offset = (currentPage - 1) * pageSize;
    return (data ?? []).slice(offset, offset + pageSize);
  }, [currentPage, data, pageSize]);

  return {
    publications: paginatedPublications,
    publicationsCount: data?.length ?? 0,
    isGettingPublications: isLoading,
  };
};
