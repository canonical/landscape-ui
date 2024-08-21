import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import { ApiError } from "@/types/ApiError";
import { QueryFnType, QueryFnTypeWithRequiredParam } from "@/types/QueryFnType";
import {
  IdentityProvider,
  SingleIdentityProvider,
  SupportedIdentityProvider,
} from "../types";

interface GetProvidersParams {
  account_name: string;
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
        authFetch!.get("/auth/supported-providers", {
          params: queryParams,
        }),
      ...config,
    });

  const getProvidersQuery: QueryFnTypeWithRequiredParam<
    AxiosResponse<{ results: IdentityProvider[] }>,
    GetProvidersParams
  > = (queryParams, config = {}) =>
    useQuery<
      AxiosResponse<{ results: IdentityProvider[] }>,
      AxiosError<ApiError>
    >({
      queryKey: ["oidcProviders"],
      queryFn: () =>
        authFetch!.get("/auth/oidc-providers", {
          params: queryParams,
        }),
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
      queryClient.invalidateQueries({ queryKey: ["oidcProviders"] }),
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

  return {
    addProviderQuery,
    getSupportedProvidersQuery,
    getProvidersQuery,
    getSingleProviderQuery,
    updateProviderQuery,
    deleteProviderQuery,
  };
}
