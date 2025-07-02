import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface RunSecurityProfileParams {
  id: number;
}

export const useRunSecurityProfile = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RunSecurityProfileParams
  >({
    mutationFn: async ({ id }) =>
      authFetch.post(`security-profiles/${id}:execute`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["securityProfiles"] }),
  });

  return {
    isRunningSecurityProfile: isPending,
    runSecurityProfile: mutateAsync,
  };
};
