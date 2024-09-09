import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthUser } from "@/context/auth";
import { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import { ApiError } from "@/types/ApiError";
import { QueryFnType, QueryFnTypeWithRequiredParam } from "@/types/QueryFnType";
import {
  IdentityProvider,
  SingleIdentityProvider,
  SupportedIdentityProvider,
} from "../types";

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

export interface GetAuthUrlParams {
  id: number;
  return_to?: string;
}

interface GetAuthStateParams {
  code: string;
  state: string;
}

interface GetAuthStateResponse extends AuthUser {
  return_to?: string;
}

interface GetUbuntuOneUrlParams {
  return_to?: string;
}

export default function useIdentityProviders() {
  const queryClient = useQueryClient();
  const authFetch = useFetch();

  const getSupportedProvidersQuery: QueryFnType<
    AxiosResponse<{ results: SupportedIdentityProvider[] }>,
    {}
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

  const getLoginMethodsQuery: QueryFnType<AxiosResponse<LoginMethods>, {}> = (
    queryParams = {},
    config = {},
  ) =>
    useQuery<AxiosResponse<LoginMethods>, AxiosError<ApiError>>({
      queryKey: ["loginMethods"],
      queryFn: () => authFetch!.get("/login/methods", { params: queryParams }),
      ...config,
    });

  const getSingleProviderQuery: QueryFnTypeWithRequiredParam<
    AxiosResponse<SingleIdentityProvider>,
    SingleProviderParams
  > = ({ providerId, ...queryParams }, config = {}) =>
    useQuery<AxiosResponse<SingleIdentityProvider>, AxiosError<ApiError>>({
      queryKey: ["oidcProviders", { providerId }],
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
      authFetch!.put(`/auth/oidc-providers/${providerId}`, params),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["oidcProviders"] }),
  });

  const deleteProviderQuery = useMutation<
    Activity,
    AxiosError<ApiError>,
    SingleProviderParams
  >({
    mutationFn: ({ providerId }) =>
      authFetch!.delete(`/auth/oidc-providers/${providerId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["oidcProviders"] }),
  });

  const getAuthUrlQuery: QueryFnTypeWithRequiredParam<
    AxiosResponse<{ location: string }>,
    GetAuthUrlParams
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<{ location: string }>, AxiosError<ApiError>>({
      queryKey: ["authUrl"],
      queryFn: () => authFetch!.get("/auth/start", { params: queryParams }),
      ...config,
    });

  const getAuthStateQuery: QueryFnTypeWithRequiredParam<
    AxiosResponse<GetAuthStateResponse>,
    GetAuthStateParams
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<GetAuthStateResponse>, AxiosError<ApiError>>({
      queryKey: ["authUser"],
      queryFn: () =>
        authFetch!.get("/auth/handle-code", { params: queryParams }),
      ...config,
    });

  const getUbuntuOneUrlQuery: QueryFnType<
    AxiosResponse<{ location: string }>,
    GetUbuntuOneUrlParams
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<{ location: string }>, AxiosError<ApiError>>({
      queryKey: ["ubuntuOneLogin"],
      queryFn: () =>
        authFetch!.get("/auth/ubuntu-one/begin", { params: queryParams }),
      ...config,
    });

  return {
    addProviderQuery,
    getSupportedProvidersQuery,
    getLoginMethodsQuery,
    getSingleProviderQuery,
    updateProviderQuery,
    deleteProviderQuery,
    getAuthUrlQuery,
    getAuthStateQuery,
    getUbuntuOneUrlQuery,
  };
}
