import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  MirrorWritable,
  MirrorServiceUpdateMirrorError,
  MirrorServiceUpdateMirrorResponse,
} from "@canonical/landscape-openapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

// MirrorWritable types gpgKey as non-nullable, but the API uses an explicit
// null to clear an existing key (omitting it keeps the current key), so allow
// null here.
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
    },
  });
}
