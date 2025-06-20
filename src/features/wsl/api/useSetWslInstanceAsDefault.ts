import type { Activity } from "@/features/activities";
import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface SetWslInstanceAsDefaultParams {
  child_id: number;
  parent_id: number;
}

export const useSetWslInstanceAsDefault = () => {
  const authFetchOld = useFetchOld();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    SetWslInstanceAsDefaultParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("SetDefaultChildComputer", { params }),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["wsl-hosts"] }),
        queryClient.invalidateQueries({ queryKey: ["instances"] }),
      ]),
  });

  return {
    isSettingWslInstanceAsDefault: isPending,
    setWslInstanceAsDefault: mutateAsync,
  };
};
