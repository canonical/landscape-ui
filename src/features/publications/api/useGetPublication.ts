import type { Publication } from "../types";
import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useGetPublication = (id: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<Publication, AxiosError<ApiError>>({
    queryKey: ["publications", id],
    queryFn: async () => {
      const response = await authFetchDebArchive.get<Publication>(
        `publications/${id}`,
      );
      return response.data;
    },
    enabled: !!id,
  });

  return {
    publication: data,
    isGettingPublication: isLoading,
    publicationError: error,
  };
};
