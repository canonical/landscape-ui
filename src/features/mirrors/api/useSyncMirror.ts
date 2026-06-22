import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  SyncMirrorRequest,
  MirrorServiceSyncMirrorError,
  MirrorServiceSyncMirrorResponse,
} from "@canonical/landscape-openapi";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useSyncMirror(name: string) {
  const authFetchDebArchive = useFetchDebArchive();

  return useMutation<
    AxiosResponse<MirrorServiceSyncMirrorResponse>,
    AxiosError<MirrorServiceSyncMirrorError>,
    Omit<SyncMirrorRequest, "name">
  >({
    mutationKey: ["mirror", name, "sync"],
    mutationFn: async (params) =>
      authFetchDebArchive.post(`${name}:sync`, params),
  });
}
