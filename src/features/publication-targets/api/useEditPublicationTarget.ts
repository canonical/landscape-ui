import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  PublicationTargetServiceUpdatePublicationTargetError,
  PublicationTargetServiceUpdatePublicationTargetResponse,
  PublicationTargetWritable,
} from "@canonical/landscape-openapi";

export default function useEditPublicationTarget() {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const editPublicationTargetQuery = useMutation<
    AxiosResponse<PublicationTargetServiceUpdatePublicationTargetResponse>,
    AxiosError<PublicationTargetServiceUpdatePublicationTargetError>,
    PublicationTargetWritable
  >({
    mutationKey: ["publication-targets", "edit"],
    mutationFn: async ({ name, ...params }) =>
      authFetchDebArchive.patch(name ?? "", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publication-targets"] }),
  });

  return {
    editPublicationTargetQuery,
  };
}
