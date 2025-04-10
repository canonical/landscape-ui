import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { SecurityProfile } from "../types";

export interface UpdateSecurityProfileParams
  extends Partial<
    Pick<
      SecurityProfile,
      "access_group" | "all_computers" | "schedule" | "tags" | "title"
    >
  > {
  id: number;
  restart_deliver_delay_window?: number;
  restart_deliver_delay?: number;
}

export const useUpdateSecurityProfile = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    SecurityProfile,
    AxiosError<ApiError>,
    UpdateSecurityProfileParams
  >({
    mutationFn: async ({ id, ...params }) =>
      authFetch.patch(`security-profiles/${id}`, params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["securityProfiles"] }),
  });

  return {
    isSecurityProfileUpdating: isPending,
    updateSecurityProfile: mutateAsync,
  };
};
