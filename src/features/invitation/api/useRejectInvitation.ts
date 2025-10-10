import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface RejectInvitationParams {
  invitation_id: string;
}

export const useRejectInvitation = () => {
  const authFetch = useFetch();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RejectInvitationParams
  >({
    mutationFn: async (params) => authFetch.post("reject-invitation", params),
  });

  return {
    rejectInvitation: mutateAsync,
    isRejectingInvitation: isPending,
  };
};
