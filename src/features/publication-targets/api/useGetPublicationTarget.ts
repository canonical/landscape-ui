import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  PublicationTargetServiceGetPublicationTargetError,
  PublicationTargetServiceGetPublicationTargetResponse,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

const NOT_FOUND_STATUS = 404;

export default function useGetPublicationTarget(
  publicationTargetId: string,
  enabled = true,
) {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, error, isPending } = useQuery<
    AxiosResponse<PublicationTargetServiceGetPublicationTargetResponse>,
    AxiosError<PublicationTargetServiceGetPublicationTargetError>
  >({
    queryKey: ["publication-target", publicationTargetId],
    queryFn: async () => {
      const response = await authFetchDebArchive.get(
        `publicationTargets/${publicationTargetId}`,
      );

      if (!response.data.publicationTargetId) {
        throw new Error(
          `Publication target ${publicationTargetId} was not found`,
        );
      }

      return response;
    },
    enabled,
  });

  if (!enabled || isPending) {
    return undefined;
  }

  if (error?.response?.status === NOT_FOUND_STATUS || !data) {
    throw new Error(`Publication target ${publicationTargetId} was not found`);
  }

  return data.data;
}
