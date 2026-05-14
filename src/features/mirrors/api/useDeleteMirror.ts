import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  DeleteMirrorData,
  DeleteMirrorError,
  DeleteMirrorResponse,
} from "@canonical/landscape-openapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
export function useDeleteMirror(name: DeleteMirrorData["path"]["name_1"]) {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<DeleteMirrorResponse>,
    AxiosError<DeleteMirrorError>,
    DeleteMirrorData["query"]
  >({
    mutationKey: ["mirrors"],
    mutationFn: async (params) => authFetchDebArchive.delete(name, { params }),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["mirrors"],
      });
    },
  });
}
