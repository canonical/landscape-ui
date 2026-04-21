import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { PublishPublicationResponse } from "../types";
import type { PublicationServicePublishPublicationBody } from "../types/Publication";

interface PublishPublicationParams {
  publicationName: string;
  body: PublicationServicePublishPublicationBody;
}

export default function usePublishPublication() {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const publishPublicationQuery = useMutation<
    AxiosResponse<PublishPublicationResponse>,
    AxiosError<ApiError>,
    PublishPublicationParams
  >({
    mutationKey: ["publications", "publish"],
    mutationFn: async ({ publicationName, body }) =>
      authFetchDebArchive.post(`${publicationName}:publish`, body),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publications"] }),
  });

  return {
    publishPublicationQuery,
  };
}
