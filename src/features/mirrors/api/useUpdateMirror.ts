import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  MirrorWritable,
  MirrorServiceUpdateMirrorError,
  MirrorServiceUpdateMirrorResponse,
} from "@canonical/landscape-openapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

// The API needs an explicit null to clear an existing key
type UpdateMirrorParams = Omit<MirrorWritable, "gpgKey"> & {
  gpgKey?: MirrorWritable["gpgKey"] | null;
};

export function useUpdateMirror(name: string) {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<MirrorServiceUpdateMirrorResponse>,
    AxiosError<MirrorServiceUpdateMirrorError>,
    UpdateMirrorParams
  >({
    mutationKey: ["mirror", name, "update"],
    mutationFn: async (params) => authFetchDebArchive.patch(name, params),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["mirrors"] });
      queryClient.invalidateQueries({ queryKey: ["mirror", name] });
      queryClient.invalidateQueries({ queryKey: ["operations"] });
    },
  });
}
