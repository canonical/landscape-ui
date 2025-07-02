import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ScriptProfile } from "../types";
import type { Trigger } from "../types/ScriptProfile";

export interface EditScriptProfileParams extends Pick<ScriptProfile, "id"> {
  all_computers?: boolean;
  tags?: string[];
  time_limit?: number;
  title?: string;
  trigger?: Trigger;
  username?: string;
}

export const useEditScriptProfile = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    ScriptProfile,
    AxiosError<ApiError>,
    EditScriptProfileParams
  >({
    mutationFn: async ({ id, ...params }) =>
      authFetch.patch(`script-profiles/${id}`, params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["scriptProfiles"] }),
  });

  return {
    isEditingScriptProfile: isPending,
    editScriptProfile: mutateAsync,
  };
};
