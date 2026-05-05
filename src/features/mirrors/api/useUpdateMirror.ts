import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  UpdateMirrorData,
  UpdateMirrorError,
  UpdateMirrorResponse,
} from "@canonical/landscape-openapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useUpdateMirror(name: UpdateMirrorData["path"]["mirror.name"]) {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<UpdateMirrorResponse>,
    AxiosError<UpdateMirrorError>,
    UpdateMirrorData["body"]
  >({
    mutationKey: ["mirror", name, "update"],
    mutationFn: async (params) => authFetchDebArchive.patch(name, params),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["mirrors"] });
      queryClient.invalidateQueries({ queryKey: ["mirror", name] });
    },
  });
}
