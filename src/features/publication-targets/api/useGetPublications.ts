import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { Publication } from "../types";

interface GetPublicationsResponse {
  publications: Publication[];
  next_page_token?: string;
}

interface GetPublicationsParams {
  publication_target?: string;
  limit?: number;
  offset?: number;
}

export default function useGetPublications(
  queryParams: GetPublicationsParams = {},
) {
  const authFetch = useFetch();

  const { data, isLoading } = useQuery<
    AxiosResponse<GetPublicationsResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["publication-targets", "publications", queryParams],
    queryFn: async () =>
      authFetch.get("publications", { params: queryParams }),
  });

  return {
    publications: data?.data.publications ?? [],
    isGettingPublications: isLoading,
  };
}
