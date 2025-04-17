import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { RebootProfile } from "../types";

interface RemoveRebootProfileParams {
  id: number;
}

export default function useRemoveRebootProfile() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const removeRebootProfileQuery = useMutation<
    AxiosResponse<RebootProfile>,
    AxiosError<ApiError>,
    RemoveRebootProfileParams
  >({
    mutationKey: ["rebootprofiles", "remove"],
    mutationFn: async (params) =>
      authFetch.delete(`rebootprofiles/${params.id}`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["rebootprofiles"] }),
  });

  const { mutateAsync, isPending } = removeRebootProfileQuery;

  return {
    removeRebootProfile: mutateAsync,
    isRemovingRebootProfile: isPending,
  };
}
