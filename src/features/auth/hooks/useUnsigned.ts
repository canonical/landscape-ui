import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  QueryFnType,
  QueryFnTypeWithRequiredParam,
} from "@/types/api/QueryFnType";
import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import { API_URL } from "@/constants";
import type { AuthUser, IdentityProvider } from "../types";
import type { ApiError } from "@/types/api/ApiError";
import type { InvitationSummary } from "@/types/Invitation";
import { useState } from "react";

export interface LoginMethods {
  oidc: {
    available: boolean;
    configurations: IdentityProvider[];
  };
  pam: {
    available: boolean;
    enabled: boolean;
  };
  password: {
    available: boolean;
    enabled: boolean;
  };
  standalone_oidc: {
    available: boolean;
    enabled: boolean;
  };
  ubuntu_one: {
    available: boolean;
    enabled: boolean;
  };
}

export type AuthStateResponse =
  | Record<never, unknown>
  | (AuthUser & {
      return_to: {
        url: string | null;
        external: boolean;
      } | null;
      self_hosted: boolean;
      identity_source: string;
      attach_code: string | null;
    });

export interface LoginRequestParams {
  email: string;
  password: string;
}

export interface GetOidcUrlParams {
  id?: number;
  external?: boolean;
  invitation_id?: string;
  return_to?: string;
  attach_code?: string;
}

interface GetAuthStateParams {
  code: string;
  state: string;
}

export interface GetUbuntuOneUrlParams {
  external?: boolean;
  invitation_id?: string;
  return_to?: string;
}

interface GetUbuntuOneStateParams {
  url: string;
}

export interface GetInvitationSummaryParams {
  invitationId: string;
}

export default function useUnsignedHooks() {
  const [axiosInstance] = useState(() => axios.create({ baseURL: API_URL }));

  const getLoginMethodsQuery: QueryFnType<
    AxiosResponse<LoginMethods>,
    Record<never, unknown>
  > = (
    config: Omit<
      UseQueryOptions<AxiosResponse<LoginMethods, AxiosError<ApiError>>>,
      "queryKey" | "queryFn"
    > = {},
  ) =>
    useQuery({
      queryKey: ["loginMethods"],
      queryFn: async () => axiosInstance.get<LoginMethods>("login/methods"),
      ...config,
    });

  const signInWithEmailAndPasswordQuery = useMutation<
    AxiosResponse<AuthStateResponse>,
    AxiosError<ApiError>,
    LoginRequestParams
  >({
    mutationFn: async (params) => axiosInstance.post("login", params),
  });

  const getOidcUrlQuery: QueryFnTypeWithRequiredParam<
    AxiosResponse<{ location: string }>,
    GetOidcUrlParams
  > = (queryParams, config = {}) =>
    useQuery({
      queryKey: ["oidcUrl", queryParams],
      queryFn: async () =>
        axiosInstance.get<{ location: string }>("auth/start", {
          params: queryParams,
        }),
      ...config,
      gcTime: 0,
    });

  const getAuthStateWithOidcQuery: QueryFnTypeWithRequiredParam<
    AxiosResponse<AuthStateResponse>,
    GetAuthStateParams
  > = (queryParams, config = {}) =>
    useQuery({
      queryKey: ["authUser"],
      queryFn: async () =>
        axiosInstance.get<AuthStateResponse>("auth/handle-code", {
          params: queryParams,
        }),
      ...config,
      gcTime: 0,
    });

  const getUbuntuOneUrlQuery: QueryFnType<
    AxiosResponse<{ location: string }>,
    GetUbuntuOneUrlParams
  > = (queryParams = {}, config = {}) =>
    useQuery({
      queryKey: ["ubuntuOneUrl", queryParams],
      queryFn: async () =>
        axiosInstance.get<{ location: string }>("auth/ubuntu-one/start", {
          params: queryParams,
        }),
      ...config,
    });

  const getAuthStateWithUbuntuOneQuery: QueryFnTypeWithRequiredParam<
    AxiosResponse<AuthStateResponse>,
    GetUbuntuOneStateParams
  > = (queryParams, config = {}) =>
    useQuery({
      queryKey: ["authUser"],
      queryFn: async () =>
        axiosInstance.get<AuthStateResponse>("auth/ubuntu-one/complete", {
          params: queryParams,
        }),
      ...config,
      gcTime: 0,
    });

  const getInvitationSummaryQuery: QueryFnTypeWithRequiredParam<
    AxiosResponse<InvitationSummary>,
    GetInvitationSummaryParams
  > = ({ invitationId }, config = {}) =>
    useQuery({
      queryKey: ["invitationSummary", { invitationId }],
      queryFn: async () =>
        axiosInstance.get<InvitationSummary>(
          `/invitations/${invitationId}/summary`,
        ),
      ...config,
    });

  const getAuthStateQuery: QueryFnType<
    AxiosResponse<AuthStateResponse>,
    Record<never, unknown>
  > = (_, config = {}) =>
    useQuery({
      queryKey: ["authUser"],
      queryFn: async () => axiosInstance.get<AuthStateResponse>("me"),
      ...config,
      gcTime: 0,
    });

  return {
    getAuthStateQuery,
    getAuthStateWithOidcQuery,
    getAuthStateWithUbuntuOneQuery,
    getInvitationSummaryQuery,
    getLoginMethodsQuery,
    getOidcUrlQuery,
    getUbuntuOneUrlQuery,
    signInWithEmailAndPasswordQuery,
  };
}
