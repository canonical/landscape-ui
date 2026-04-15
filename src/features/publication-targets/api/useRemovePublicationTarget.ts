import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface RemovePublicationTargetParams {
  name: string;
}

export default function useRemovePublicationTarget() {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const removePublicationTargetQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemovePublicationTargetParams
  >({
    mutationKey: ["publication-targets", "remove"],
    mutationFn: async ({ name }) => authFetchDebArchive.delete(name),
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
