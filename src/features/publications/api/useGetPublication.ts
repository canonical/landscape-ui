import type { Publication } from "../types";
import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface UseGetPublicationParams {
  publicationName: string;
}

export default function useGetPublication(
  { publicationName }: UseGetPublicationParams,
  options: Omit<
    UseQueryOptions<AxiosResponse<Publication>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<
    AxiosResponse<Publication>,
    AxiosError<ApiError>
  >({
    queryKey: ["publications", "details", publicationName],
    queryFn: async () => authFetchDebArchive.get(publicationName),
    ...options,
  });

  return {
    publication: data?.data,
    isGettingPublication: isLoading,
  };
}
