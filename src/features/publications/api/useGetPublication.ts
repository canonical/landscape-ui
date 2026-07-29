import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  PublicationServiceGetPublicationError,
  PublicationServiceGetPublicationResponse,
} from "@canonical/landscape-openapi";
import { rethrowWithNotFoundMessage } from "@/utils/queryErrors";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

type GetPublicationError =
  | AxiosError<PublicationServiceGetPublicationError>
  | Error;

export const useGetPublication = (publicationId: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isPending } = useQuery<
    AxiosResponse<PublicationServiceGetPublicationResponse>,
    GetPublicationError
  >({
    queryKey: ["publications", publicationId],
    queryFn: async () => {
      try {
        const response = await authFetchDebArchive.get(
          `publications/${publicationId}`,
        );

        if (!response.data?.publicationId) {
          throw new Error(`Publication ${publicationId} was not found`);
        }

        return response;
      } catch (caughtError) {
        return rethrowWithNotFoundMessage(
          caughtError,
          `Publication ${publicationId} was not found`,
        );
      }
    },
    enabled: !!publicationId,
    throwOnError: true,
  });

  return {
    publication: data?.data,
    isGettingPublication: !!publicationId && isPending,
  };
};
