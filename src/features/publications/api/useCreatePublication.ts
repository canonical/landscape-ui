import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  PublicationWritable,
  PublicationServiceCreatePublicationError,
  PublicationServiceCreatePublicationResponse,
} from "@canonical/landscape-openapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface CreatePublicationParams {
  body: PublicationWritable;
  publicationId?: string;
}

export const useCreatePublication = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<PublicationServiceCreatePublicationResponse>,
    AxiosError<PublicationServiceCreatePublicationError>,
    CreatePublicationParams
  >({
    mutationKey: ["publications", "create"],
    mutationFn: async ({ body, publicationId }) =>
      authFetchDebArchive.post("publications", body, {
        params: { publicationId },
      }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publications"] }),
  });

  return {
    createPublication: mutateAsync,
    isCreatingPublication: isPending,
  };
};
