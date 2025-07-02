import type { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type {
  QueryFnType,
  QueryFnTypeWithRequiredParam,
} from "@/types/api/QueryFnType";
import type {
  IdentityProvider,
  SingleIdentityProvider,
  SupportedIdentityProvider,
} from "../types";

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
      queryFn: async () =>
        authFetch.get("/auth/supported-providers", { params: queryParams }),
      ...config,
    });

  const getSingleProviderQuery: QueryFnTypeWithRequiredParam<
    AxiosResponse<SingleIdentityProvider>,
    SingleProviderParams
  > = ({ providerId, ...queryParams }, config = {}) =>
    useQuery<AxiosResponse<SingleIdentityProvider>, AxiosError<ApiError>>({
      queryKey: ["loginMethods", { loginType: "oidcProviders", providerId }],
      queryFn: async () =>
        authFetch.get(`/auth/oidc-providers/${providerId}`, {
          params: queryParams,
        }),
      ...config,
    });

  const addProviderQuery = useMutation<
    IdentityProvider,
    AxiosError<ApiError>,
    AddProviderParams
  >({
    mutationFn: async (params) =>
      authFetch.post(`/auth/oidc-providers`, params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["loginMethods"] }),
  });

  const updateProviderQuery = useMutation<
    IdentityProvider,
    AxiosError<ApiError>,
    UpdateProviderParams
  >({
    mutationFn: async ({ providerId, ...params }) =>
      authFetch.patch(`/auth/oidc-providers/${providerId}`, params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["loginMethods"] }),
  });

  const deleteProviderQuery = useMutation<
    Activity,
    AxiosError<ApiError>,
    SingleProviderParams
  >({
    mutationFn: async ({ providerId }) =>
      authFetch.delete(`/auth/oidc-providers/${providerId}`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["loginMethods"] }),
  });

  const toggleUbuntuOneQuery = useMutation<
    Activity,
    AxiosError<ApiError>,
    { ubuntu_one: boolean }
  >({
    mutationFn: async (params) => authFetch.patch("preferences", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["loginMethods"] }),
  });

  const getClassicDashboardUrlQuery: QueryFnType<
    AxiosResponse<{ url: string }>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery({
      queryKey: ["classicDashboardUrl"],
      queryFn: async () =>
        authFetch.get<{ url: string }>("classic_dashboard_url", {
          params: queryParams,
        }),
      ...config,
    });

  const switchAccountQuery = useMutation<
    AxiosResponse<{ token: string }>,
    AxiosError<ApiError>,
    SwitchAccountParams
  >({
    mutationFn: async (params) => authFetch.post("switch-account", params),
    onSuccess: async () => {
      queryClient.removeQueries();
      return queryClient.refetchQueries();
    },
  });

  const handleLogoutQuery = useMutation({
    mutationFn: async () => authFetch.post("logout"),
  });

  return {
    addProviderQuery,
    deleteProviderQuery,
    getClassicDashboardUrlQuery,
    getSingleProviderQuery,
    getSupportedProvidersQuery,
    handleLogoutQuery,
    switchAccountQuery,
    toggleUbuntuOneQuery,
    updateProviderQuery,
  };
}
