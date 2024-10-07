import axios, { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import { ApiError } from "@/types/ApiError";
import { QueryFnType, QueryFnTypeWithRequiredParam } from "@/types/QueryFnType";
import {
  AuthStateResponse,
  IdentityProvider,
  SingleIdentityProvider,
  SupportedIdentityProvider,
} from "../types";
import { InvitationSummary } from "@/types/Invitation";
import { API_URL } from "@/constants";

interface LoginMethods {
  oidc: {
    available: boolean;
    configurations: IdentityProvider[];
  };
  password: {
    available: boolean;
    enabled: boolean;
  };
  ubuntu_one: {
    available: boolean;
    enabled: boolean;
  };
}

interface SingleProviderParams {
  providerId: number;
}

export interface AddProviderParams {
  configuration: {
    issuer: string;
    client_id: string;
    client_secret: string;
    name: string;
    provider: string;
  };
  enabled: boolean;
}

type UpdateProviderParams = SingleProviderParams & AddProviderParams;

export interface GetOidcUrlParams {
  id: number;
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

interface GetInvitationSummaryParams {
  invitationId: string;
}

export interface LoginRequestParams {
  email: string;
  password: string;
}

interface SwitchAccountParams {
  account_name: string;
}

export default function useAuthHandle() {
  const queryClient = useQueryClient();
  const authFetch = useFetch();

  const getSupportedProvidersQuery: QueryFnType<
    AxiosResponse<{ results: SupportedIdentityProvider[] }>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery<
      AxiosResponse<{ results: SupportedIdentityProvider[] }>,
      AxiosError<ApiError>
    >({
      queryKey: ["supportedOidcProviders"],
      queryFn: () =>
        authFetch!.get("/auth/supported-providers", { params: queryParams }),
      ...config,
    });

  const getLoginMethodsQuery: QueryFnType<
    AxiosResponse<LoginMethods>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<LoginMethods>, AxiosError<ApiError>>({
      queryKey: ["loginMethods"],
      queryFn: () =>
        axios.get(`${API_URL}login/methods`, { params: queryParams }),
      ...config,
    });

  const getSingleProviderQuery: QueryFnTypeWithRequiredParam<
    AxiosResponse<SingleIdentityProvider>,
    SingleProviderParams
  > = ({ providerId, ...queryParams }, config = {}) =>
    useQuery<AxiosResponse<SingleIdentityProvider>, AxiosError<ApiError>>({
      queryKey: ["loginMethods", { loginType: "oidcProviders", providerId }],
      queryFn: () =>
        authFetch!.get(`/auth/oidc-providers/${providerId}`, {
          params: queryParams,
        }),
      ...config,
    });

  const addProviderQuery = useMutation<
    IdentityProvider,
    AxiosError<ApiError>,
    AddProviderParams
  >({
    mutationFn: (params) => authFetch!.post(`/auth/oidc-providers`, params),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["loginMethods"] }),
  });

  const updateProviderQuery = useMutation<
    IdentityProvider,
    AxiosError<ApiError>,
    UpdateProviderParams
  >({
    mutationFn: ({ providerId, ...params }) =>
      authFetch!.patch(`/auth/oidc-providers/${providerId}`, params),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["loginMethods"] }),
  });

  const deleteProviderQuery = useMutation<
    Activity,
    AxiosError<ApiError>,
    SingleProviderParams
  >({
    mutationFn: ({ providerId }) =>
      authFetch!.delete(`/auth/oidc-providers/${providerId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["loginMethods"] }),
  });

  const getOidcUrlQuery: QueryFnTypeWithRequiredParam<
    AxiosResponse<{ location: string }>,
    GetOidcUrlParams
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<{ location: string }>, AxiosError<ApiError>>({
      queryKey: ["oidcUrl", queryParams],
      queryFn: () => authFetch!.get("/auth/start", { params: queryParams }),
      ...config,
      gcTime: 0,
    });

  const getAuthStateWithOidcQuery: QueryFnTypeWithRequiredParam<
    AxiosResponse<AuthStateResponse>,
    GetAuthStateParams
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<AuthStateResponse>, AxiosError<ApiError>>({
      queryKey: ["authUser"],
      queryFn: () =>
        authFetch!.get("/auth/handle-code", { params: queryParams }),
      ...config,
      gcTime: 0,
    });

  const getUbuntuOneUrlQuery: QueryFnType<
    AxiosResponse<{ location: string }>,
    GetUbuntuOneUrlParams
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<{ location: string }>, AxiosError<ApiError>>({
      queryKey: ["ubuntuOneUrl", queryParams],
      queryFn: () =>
        authFetch!.get("/auth/ubuntu-one/start", { params: queryParams }),
      ...config,
    });

  const getAuthStateWithUbuntuOneQuery: QueryFnTypeWithRequiredParam<
    AxiosResponse<AuthStateResponse>,
    GetUbuntuOneStateParams
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<AuthStateResponse>, AxiosError<ApiError>>({
      queryKey: ["authUser"],
      queryFn: () =>
        authFetch!.get("/auth/ubuntu-one/complete", {
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
        authFetch!.get<InvitationSummary>(
          `/invitations/${invitationId}/summary`,
        ),
      ...config,
    });

  const toggleUbuntuOneQuery = useMutation<
    Activity,
    AxiosError<ApiError>,
    { ubuntu_one: boolean }
  >({
    mutationFn: (params) => authFetch!.patch("preferences", params),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["loginMethods"] }),
  });

  const getClassicDashboardUrlQuery: QueryFnType<
    AxiosResponse<{ url: string }>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery({
      queryKey: ["classicDashboardUrl"],
      queryFn: () =>
        authFetch!.get<{ url: string }>("classic_dashboard_url", {
          params: queryParams,
        }),
      ...config,
    });

  const signInWithEmailAndPasswordQuery = useMutation<
    AxiosResponse<AuthStateResponse>,
    AxiosError<ApiError>,
    { email: string; password: string }
  >({
    mutationFn: (params) =>
      axios.post<
        AuthStateResponse,
        AxiosResponse<AuthStateResponse>,
        LoginRequestParams
      >(`${API_URL}login`, params),
  });

  const switchAccountQuery = useMutation<
    AxiosResponse<{ token: string }>,
    AxiosError<ApiError>,
    SwitchAccountParams
  >({
    mutationFn: (params) => authFetch!.post("switch-account", params),
    onSuccess: () => {
      queryClient.removeQueries();
      return queryClient.refetchQueries();
    },
  });

  const handleLogoutQuery = useMutation({
    mutationFn: () => authFetch!.post("logout"),
  });

  return {
    addProviderQuery,
    getSupportedProvidersQuery,
    getLoginMethodsQuery,
    getSingleProviderQuery,
    updateProviderQuery,
    deleteProviderQuery,
    getOidcUrlQuery,
    getAuthStateWithOidcQuery,
    getUbuntuOneUrlQuery,
    getAuthStateWithUbuntuOneQuery,
    getInvitationSummaryQuery,
    toggleUbuntuOneQuery,
    getClassicDashboardUrlQuery,
    signInWithEmailAndPasswordQuery,
    switchAccountQuery,
    handleLogoutQuery,
  };
}
