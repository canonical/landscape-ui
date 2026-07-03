import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  PublicationTargetWritable,
  PublicationTargetServiceCreatePublicationTargetError,
  PublicationTargetServiceCreatePublicationTargetResponse,
} from "@canonical/landscape-openapi";

export default function useCreatePublicationTarget() {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const createPublicationTargetQuery = useMutation<
    AxiosResponse<PublicationTargetServiceCreatePublicationTargetResponse>,
    AxiosError<PublicationTargetServiceCreatePublicationTargetError>,
    Omit<PublicationTargetWritable, "name">
  >({
    mutationKey: ["publication-targets", "create"],
    mutationFn: async (params) =>
      authFetchDebArchive.post("publicationTargets", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publication-targets"] }),
  });

  return {
    createPublicationTargetQuery,
  };
}
