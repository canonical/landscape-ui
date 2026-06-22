import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  MirrorServiceDeleteMirrorData,
  MirrorServiceDeleteMirrorError,
} from "@canonical/landscape-openapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useDeleteMirror(name: string) {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse,
    AxiosError<MirrorServiceDeleteMirrorError>,
    MirrorServiceDeleteMirrorData["query"]
  >({
    mutationKey: ["mirrors", "delete"],
    mutationFn: async (params) => authFetchDebArchive.delete(name, { params }),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["mirrors"],
      });
    },
  });
}
