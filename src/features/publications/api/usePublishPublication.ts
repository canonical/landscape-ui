import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  PublishPublicationData,
  PublishPublicationError,
  PublishPublicationResponse,
} from "@canonical/landscape-openapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface PublishPublicationParams {
  publicationName: PublishPublicationData["path"]["name"];
  body: PublishPublicationData["body"];
}

export const usePublishPublication = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<PublishPublicationResponse>,
    AxiosError<PublishPublicationError>,
    PublishPublicationParams
  >({
    mutationKey: ["publications", "publish"],
    mutationFn: async ({ publicationName, body }) =>
      authFetchDebArchive.post(`${publicationName}:publish`, body),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publications"] }),
  });

  return {
    publishPublication: mutateAsync,
    isPublishingPublication: isPending,
  };
};
