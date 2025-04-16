import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ScriptProfile } from "../types";
import type { Trigger } from "../types/ScriptProfile";

export interface AddScriptProfileParams {
  access_group: string;
  all_computers: boolean;
  script_id: number;
  tags: string[];
  time_limit: number;
  title: string;
  trigger: Trigger;
  username: string;
}

export const useAddScriptProfile = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    ScriptProfile,
    AxiosError<ApiError>,
    AddScriptProfileParams
  >({
    mutationFn: async (params) => authFetch.post("script-profiles", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["scriptProfiles"] }),
  });

  return {
    isAddingScriptProfile: isPending,
    addScriptProfile: mutateAsync,
  };
};
