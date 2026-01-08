import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { API_URL } from "@/constants";
import type { AuthStateResponse, GetUbuntuOneUrlParams } from "@/features/auth";

const publicFetch = axios.create({ baseURL: API_URL });

export function useGetUbuntuOneUrl(
  params: GetUbuntuOneUrlParams,
  enabled: boolean,
) {
  const { data, isLoading, error } = useQuery<
    AxiosResponse<{ location: string }>
  >({
    queryKey: ["ubuntuOneUrl", params],
    queryFn: () =>
      publicFetch.get<{ location: string }>("auth/ubuntu-one/start", {
        params,
      }),
    enabled,
  });

  return {
    location: data?.data?.location,
    isLoading,
    error,
  };
}

export function useGetUbuntuOneCompletion(url: string, enabled: boolean) {
  const { data, isLoading, error } = useQuery<AxiosResponse<AuthStateResponse>>(
    {
      queryKey: ["authUser", "ubuntuOne", url],
      queryFn: () =>
        publicFetch.get<AuthStateResponse>("auth/ubuntu-one/complete", {
          params: { url },
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
