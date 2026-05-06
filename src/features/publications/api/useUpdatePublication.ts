import type {
  Publication,
  PublicationWritable,
} from "@canonical/landscape-openapi";
import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface UpdatePublicationParams {
  publicationName: string;
  body: PublicationWritable;
}

export default function useUpdatePublication() {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const updatePublicationQuery = useMutation<
    AxiosResponse<Publication>,
    AxiosError<ApiError>,
    UpdatePublicationParams
  >({
    mutationKey: ["publications", "update"],
    mutationFn: async ({ publicationName, body }) =>
      authFetchDebArchive.patch(
        `publications/${encodeURIComponent(publicationName)}`,
        body,
      ),
    onSuccess: async (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      queryClient.invalidateQueries({
        queryKey: ["publication", variables.publicationName],
      });
    },
  });

  return {
    updatePublicationQuery,
  };
}
