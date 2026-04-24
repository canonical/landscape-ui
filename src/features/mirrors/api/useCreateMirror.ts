import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  CreateMirrorData,
  CreateMirrorError,
  CreateMirrorResponse,
} from "@canonical/landscape-openapi";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useCreateMirror() {
  const authFetchDebArchive = useFetchDebArchive();

  return useMutation<
    AxiosResponse<CreateMirrorResponse>,
    AxiosError<CreateMirrorError>,
    CreateMirrorData["body"]
  >({
    mutationKey: ["mirrors"],
    mutationFn: async (params) => authFetchDebArchive.post("mirrors", params),
  });
}
