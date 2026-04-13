import type { Publication } from "../types";
import useFetch from "@/hooks/useFetch";
import usePageParams from "@/hooks/usePageParams";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface UseGetPublicationsReturnType {
  publications: Publication[];
  publicationsCount: number;
  isGettingPublications: boolean;
}

const useGetPublications = (): UseGetPublicationsReturnType => {
  const authFetch = useFetch();
  const { currentPage, pageSize, search } = usePageParams();

  const paramsWithPagination = {
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: search || undefined,
  };

  const { data, isLoading } = useQuery<
    AxiosResponse<ApiPaginatedResponse<Publication>>,
    AxiosError<ApiError>
  >({
    queryKey: ["publications", paramsWithPagination],
    queryFn: async () =>
      authFetch.get("publications", {
        params: paramsWithPagination,
      }),
  });

  return {
    publications: data?.data.results ?? [],
    publicationsCount: data?.data.count ?? 0,
    isGettingPublications: isLoading,
  };
};

export default useGetPublications;
