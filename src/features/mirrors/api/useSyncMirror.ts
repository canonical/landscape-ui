import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  SyncMirrorData,
  SyncMirrorError,
  SyncMirrorResponse,
} from "@canonical/landscape-openapi";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useSyncMirror(name: SyncMirrorData["path"]["name"]) {
  const authFetchDebArchive = useFetchDebArchive();

  return useMutation<
    AxiosResponse<SyncMirrorResponse>,
    AxiosError<SyncMirrorError>,
    SyncMirrorData["body"]
  >({
    mutationKey: ["mirror", name, "sync"],
    mutationFn: async (params) =>
      authFetchDebArchive.post(`${name}:sync`, params),
  });
}
