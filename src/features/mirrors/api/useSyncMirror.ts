import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  SyncMirrorRequest,
  MirrorServiceSyncMirrorError,
  MirrorServiceSyncMirrorResponse,
} from "@canonical/landscape-openapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useSyncMirror(name: string) {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<MirrorServiceSyncMirrorResponse>,
    AxiosError<MirrorServiceSyncMirrorError>,
    Omit<SyncMirrorRequest, "name">
  >({
    mutationKey: ["mirror", name, "sync"],
    mutationFn: async (params) =>
      authFetchDebArchive.post(`${name}:sync`, params),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["mirrorPackages"] });
      queryClient.invalidateQueries({ queryKey: ["mirrors"] });
      queryClient.invalidateQueries({ queryKey: ["operations"] });
    },
  });
}
