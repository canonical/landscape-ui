import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  GetPublicationError,
  GetPublicationResponse,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export const useGetPublication = (publicationId: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading, error } = useQuery<
    AxiosResponse<GetPublicationResponse>,
    AxiosError<GetPublicationError>
  >({
    queryKey: ["publications", publicationId],
    queryFn: async () =>
      authFetchDebArchive.get(`publications/${publicationId}`),
    enabled: !!publicationId,
  });

  return {
    publication: data?.data,
    publicationError: error,
    isGettingPublication: isLoading,
  };
};
