import { useMutation, useQuery } from "@tanstack/react-query";
import { QueryFnType, QueryFnTypeWithRequiredParam } from "@/types/QueryFnType";
import axios, { AxiosError, AxiosResponse } from "axios";
import { API_URL } from "@/constants";
import { AuthUser, IdentityProvider } from "../types";
import { ApiError } from "@/types/ApiError";
import { InvitationSummary } from "@/types/Invitation";
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
  > = (_, config = {}) =>
    useQuery({
      queryKey: ["loginMethods"],
      queryFn: () => axiosInstance.get<LoginMethods>("login/methods"),
      ...config,
    });

  const signInWithEmailAndPasswordQuery = useMutation<
    AxiosResponse<AuthStateResponse>,
    AxiosError<ApiError>,
    LoginRequestParams
  >({
    mutationFn: (params) => axiosInstance.post("login", params),
  });

  const getOidcUrlQuery: QueryFnTypeWithRequiredParam<
    AxiosResponse<{ location: string }>,
    GetOidcUrlParams
  > = (queryParams, config = {}) =>
    useQuery({
      queryKey: ["oidcUrl", queryParams],
      queryFn: () =>
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
      queryFn: () =>
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
      queryFn: () =>
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
      queryFn: () =>
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
      queryFn: () =>
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
      queryFn: () => axiosInstance.get<AuthStateResponse>("me"),
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
