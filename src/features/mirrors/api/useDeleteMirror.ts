import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  DeleteMirrorData,
  DeleteMirrorError,
  DeleteMirrorResponse,
} from "@canonical/landscape-openapi";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface UseDeleteMirrorVariables {
  mirrorName: DeleteMirrorData["path"]["name_1"];
  params?: DeleteMirrorData["query"];
}

export function useDeleteMirror() {
  const authFetchDebArchive = useFetchDebArchive();

  return useMutation<
    AxiosResponse<DeleteMirrorResponse>,
    AxiosError<DeleteMirrorError>,
    UseDeleteMirrorVariables
  >({
    mutationKey: ["mirrors"],
    mutationFn: async ({ mirrorName, params }) =>
      authFetchDebArchive.delete(mirrorName, { params }),
  });
}
