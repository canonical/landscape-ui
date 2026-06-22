import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  PublishPublicationRequest,
  PublicationServicePublishPublicationError,
  PublicationServicePublishPublicationResponse,
} from "@canonical/landscape-openapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export const usePublishPublication = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();
  const body: Omit<PublishPublicationRequest, "name"> = {
    forceOverwrite: true,
    forceCleanup: true,
  };

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<PublicationServicePublishPublicationResponse>,
    AxiosError<PublicationServicePublishPublicationError>,
    Pick<PublishPublicationRequest, "name">
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
