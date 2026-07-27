import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  PublicationServiceGetPublicationError,
  PublicationServiceGetPublicationResponse,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import type { AxiosError, AxiosResponse } from "axios";

const NOT_FOUND_STATUS = 404;

export const useGetPublication = (publicationId: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isPending } = useQuery<
    AxiosResponse<PublicationServiceGetPublicationResponse>,
    AxiosError<PublicationServiceGetPublicationError>
  >({
    queryKey: ["publications", publicationId],
    queryFn: async () => {
      try {
        const response = await authFetchDebArchive.get(
          `publications/${publicationId}`,
        );

        if (!response.data.publicationId) {
          throw new Error(`Publication ${publicationId} was not found`);
        }

        return response;
      } catch (caughtError) {
        if (
          isAxiosError(caughtError) &&
          caughtError.response?.status === NOT_FOUND_STATUS
        ) {
          throw new Error(`Publication ${publicationId} was not found`);
        }

        throw caughtError;
      }
    },
    enabled: !!publicationId,
    throwOnError: true,
  });

  return {
    publication: data?.data,
    isGettingPublication: isPending,
  };
};
