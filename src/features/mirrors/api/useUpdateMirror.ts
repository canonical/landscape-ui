import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  UpdateMirrorData,
  UpdateMirrorError,
  UpdateMirrorResponse,
} from "@canonical/landscape-openapi";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface UseUpdateMirrorVariables {
  mirrorName: UpdateMirrorData["path"]["mirror.name"];
  params: UpdateMirrorData["body"];
}

export function useUpdateMirror() {
  const authFetchDebArchive = useFetchDebArchive();

  return useMutation<
    AxiosResponse<UpdateMirrorResponse>,
    AxiosError<UpdateMirrorError>,
    UseUpdateMirrorVariables
  >({
    mutationKey: ["mirrors"],
    mutationFn: async ({ mirrorName, params }) =>
      authFetchDebArchive.patch(mirrorName, params),
  });
}
