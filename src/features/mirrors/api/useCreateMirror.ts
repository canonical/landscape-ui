import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  MirrorWritable,
  MirrorServiceCreateMirrorError,
  MirrorServiceCreateMirrorResponse,
} from "@canonical/landscape-openapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useCreateMirror() {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<MirrorServiceCreateMirrorResponse>,
    AxiosError<MirrorServiceCreateMirrorError>,
    Omit<MirrorWritable, "name">
  >({
    mutationKey: ["mirrors"],
    mutationFn: async (params) => authFetchDebArchive.post("mirrors", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["mirrors"] }),
  });
}
