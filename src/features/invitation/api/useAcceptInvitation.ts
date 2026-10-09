import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface AcceptInvitationParams {
  invitation_id: string;
}

export const useAcceptInvitation = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    AcceptInvitationParams
  >({
    mutationFn: async (params) => authFetch.post("accept-invitation", params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return {
    acceptInvitation: mutateAsync,
    isAcceptingInvitation: isPending,
  };
};
