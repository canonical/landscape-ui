import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  SyncMirrorData,
  SyncMirrorError,
  SyncMirrorResponse,
} from "@canonical/landscape-openapi";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface UseSyncMirrorVariables {
  mirrorName: SyncMirrorData["path"]["name"];
  params?: SyncMirrorData["body"];
}

export function useSyncMirror() {
  const authFetchDebArchive = useFetchDebArchive();

  return useMutation<
    AxiosResponse<SyncMirrorResponse>,
    AxiosError<SyncMirrorError>,
    UseSyncMirrorVariables
  >({
    mutationKey: ["mirrors"],
    mutationFn: async ({ mirrorName, params }) =>
      authFetchDebArchive.post(`${mirrorName}:sync`, params),
  });
}
