import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  MirrorWritable,
  MirrorServiceUpdateMirrorError,
  MirrorServiceUpdateMirrorResponse,
  MirrorWritable,
  MirrorServiceUpdateMirrorError,
  MirrorServiceUpdateMirrorResponse,
} from "@canonical/landscape-openapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useUpdateMirror(name: string) {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<MirrorServiceUpdateMirrorResponse>,
    AxiosError<MirrorServiceUpdateMirrorError>,
    MirrorWritable
  >({
    mutationKey: ["mirror", name, "update"],
    mutationFn: async (params) => authFetchDebArchive.patch(name, params),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["mirrors"] });
      queryClient.invalidateQueries({ queryKey: ["mirror", name] });
    },
  });
}
