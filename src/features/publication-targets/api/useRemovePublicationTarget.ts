import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  PublicationTargetServiceDeletePublicationTargetError,
  PublicationTargetServiceDeletePublicationTargetData,
} from "@canonical/landscape-openapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export default function useRemovePublicationTarget() {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const removePublicationTargetQuery = useMutation<
    AxiosResponse,
    AxiosError<PublicationTargetServiceDeletePublicationTargetError>,
    PublicationTargetServiceDeletePublicationTargetData["path"]["publicationTarget"]
  >({
    mutationKey: ["publication-targets", "remove"],
    mutationFn: async (name) => authFetchDebArchive.delete(name),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["publication-targets"] }),
        queryClient.invalidateQueries({ queryKey: ["publications"] }),
      ]),
  });

  return {
    removePublicationTargetQuery,
  };
}
