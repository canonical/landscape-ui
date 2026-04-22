import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface DeletePublicationParams {
  publicationName: string;
}

export default function useDeletePublication() {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<Record<string, unknown>>,
    AxiosError<ApiError>,
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
}
