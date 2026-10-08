import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import { useSearchParams } from "react-router";
import { API_URL, HOMEPAGE_PATH } from "@/constants";
import useAuth from "@/hooks/useAuth";

const publicFetch = axios.create({ baseURL: API_URL });

export interface AcceptInvitationParams {
  invitation_id: string;
}

export interface RegisterInvitationParams extends AcceptInvitationParams {
  name: string;
  email: string;
  identity?: string;
  password: string;
}

type AcceptInvitationVariables =
  | { mode: "accept"; params: AcceptInvitationParams }
  | { mode: "register"; params: RegisterInvitationParams };

export interface AcceptInvitationResponse {
  account_id: number;
  account_title: string;
}

export const useAcceptInvitation = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();
  const { safeRedirect } = useAuth();
  const [searchParams] = useSearchParams();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<AcceptInvitationResponse>,
    AxiosError<ApiError>,
    AcceptInvitationVariables
  >({
    mutationFn: async ({ mode, params }) => {
      const fetch = mode === "accept" ? authFetch : publicFetch;
      return fetch.post("accept-invitation", params);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      safeRedirect(searchParams.get("redirect-to") ?? HOMEPAGE_PATH, {
        replace: true,
        external: searchParams.has("external"),
      });
    },
  });

  const acceptInvitation = (params: AcceptInvitationParams) =>
    mutateAsync({ mode: "accept", params });
  const registerWithInvitation = (params: RegisterInvitationParams) =>
    mutateAsync({ mode: "register", params });

  return {
    acceptInvitation,
    registerWithInvitation,
    isAcceptingInvitation: isPending,
  };
};
