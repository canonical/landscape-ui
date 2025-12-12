import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { API_URL } from "@/constants";
import type { AuthStateResponse } from "@/features/auth";

const publicFetch = axios.create({ baseURL: API_URL });

interface UseOidcAuthParams {
  code: string;
  state: string;
}

export function useGetOidcAuth(params: UseOidcAuthParams, enabled: boolean) {
  const { data, isLoading, error } = useQuery<AxiosResponse<AuthStateResponse>>(
    {
      queryKey: ["authUser", "oidc", params],
      queryFn: () =>
        publicFetch.get<AuthStateResponse>("auth/handle-code", {
          params,
        }),
      enabled,
      gcTime: 0,
    },
  );

  return {
    authData: data?.data,
    isLoading,
    error,
  };
}
