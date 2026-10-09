import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { useSearchParams } from "react-router";
import { HOMEPAGE_PATH } from "@/constants";
import useAuth from "@/hooks/useAuth";

export interface AcceptInvitationParams {
  invitation_id: string;
}

export const useAcceptInvitation = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();
  const { safeRedirect } = useAuth();
  const [searchParams] = useSearchParams();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    AcceptInvitationParams
  >({
    mutationFn: async (params) => authFetch.post("accept-invitation", params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      safeRedirect(searchParams.get("redirect-to") ?? HOMEPAGE_PATH, {
        replace: true,
        external: searchParams.has("external"),
      });
    },
  });

  return {
    acceptInvitation: mutateAsync,
    isAcceptingInvitation: isPending,
  };
};
