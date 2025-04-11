import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ScriptProfile } from "../types";

type ArchiveScriptProfileParams = Pick<ScriptProfile, "id">;

export const useArchiveScriptProfile = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    never,
    AxiosError<ApiError>,
    ArchiveScriptProfileParams
  >({
    mutationFn: async ({ id }) =>
      authFetch.post(`script-profiles/${id}:archive`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["scriptProfiles"] }),
  });

  return {
    isArchivingScriptProfile: isPending,
    archiveScriptProfile: mutateAsync,
  };
};
