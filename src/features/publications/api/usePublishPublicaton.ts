import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { LocalRepository } from "../types";

interface PublishPublicationParams {
  name: string;
  force_overwrite?: boolean;
  force_cleanup?: boolean;
}

export const usePublishPublication = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<LocalRepository>,
    AxiosError<ApiError>,
    PublishPublicationParams
  >({
    mutationKey: ["publication", "publish"],
    mutationFn: async ({ name, ...params }) =>
      authFetchDebArchive.post(`${name}:publish`, params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publications"] }),
  });

  return {
    publishPublication: mutateAsync,
    isPublishingPublication: isPending,
  };
};
