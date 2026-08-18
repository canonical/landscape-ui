import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { rethrowWithNotFoundMessage } from "@/utils/queryErrors";
import type {
  PublicationTargetServiceGetPublicationTargetError,
  PublicationTargetServiceGetPublicationTargetResponse,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

type GetPublicationTargetError =
  AxiosError<PublicationTargetServiceGetPublicationTargetError> | Error;

export default function useGetPublicationTarget(
  publicationTargetId: string,
  enabled = true,
) {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isPending } = useQuery<
    AxiosResponse<PublicationTargetServiceGetPublicationTargetResponse>,
    GetPublicationTargetError
  >({
    queryKey: ["publication-targets", publicationTargetId],
    queryFn: async () => {
      try {
        const response = await authFetchDebArchive.get(
          `publicationTargets/${publicationTargetId}`,
        );

        if (!response.data?.publicationTargetId) {
          throw new Error(
            `Publication target ${publicationTargetId} was not found`,
          );
        }

        return response;
      } catch (caughtError) {
        return rethrowWithNotFoundMessage(
          caughtError,
          `Publication target ${publicationTargetId} was not found`,
        );
      }
    },
    enabled: enabled && !!publicationTargetId,
    throwOnError: true,
  });

  return {
    publicationTarget: data?.data,
    isGettingPublicationTarget: enabled && !!publicationTargetId && isPending,
  };
}
