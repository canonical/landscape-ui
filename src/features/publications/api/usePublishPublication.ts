import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  PublishPublicationData,
  PublishPublicationError,
  PublishPublicationResponse,
  PublicationServicePublishPublicationBody,
} from "@canonical/landscape-openapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export const usePublishPublication = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();
  const body: PublicationServicePublishPublicationBody = {
    forceOverwrite: true,
    forceCleanup: true,
  };

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<PublishPublicationResponse>,
    AxiosError<PublishPublicationError>,
    PublishPublicationData["path"]
  >({
    mutationKey: ["publications", "publish"],
    mutationFn: async ({ name }) =>
      authFetchDebArchive.post(`${name}:publish`, body),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publications"] }),
  });

  return {
    publishPublication: mutateAsync,
    isPublishingPublication: isPending,
  };
};
