import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  DeletePublicationError,
  DeletePublicationResponse,
} from "@canonical/landscape-openapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface DeletePublicationParams {
  publicationName: string;
}

export const useDeletePublication = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<DeletePublicationResponse>,
    AxiosError<DeletePublicationError>,
    DeletePublicationParams
  >({
    mutationKey: ["publications", "delete"],
    mutationFn: async ({ publicationName }) =>
      authFetchDebArchive.delete(publicationName),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publications"] }),
  });

  return {
    deletePublication: mutateAsync,
    isRemovingPublication: isPending,
  };
};
