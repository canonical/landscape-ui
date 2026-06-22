import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  PublicationServiceDeletePublicationError,
  PublicationServiceDeletePublicationData,
} from "@canonical/landscape-openapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export const useDeletePublication = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse,
    AxiosError<PublicationServiceDeletePublicationError>,
    PublicationServiceDeletePublicationData["path"]["publication"]
  >({
    mutationKey: ["publications", "delete"],
    mutationFn: async (publication) => authFetchDebArchive.delete(publication),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publications"] }),
  });

  return {
    deletePublication: mutateAsync,
    isRemovingPublication: isPending,
  };
};
