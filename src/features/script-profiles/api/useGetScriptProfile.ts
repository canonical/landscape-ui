import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ScriptProfile } from "../types";

interface GetScriptProfileParams {
  id: number;
}

interface Config {
  enabled?: boolean;
}

export const useGetScriptProfile = (
  params: GetScriptProfileParams,
  config: Config = { enabled: true },
) => {
  const authFetch = useFetch();

  const {
    data: response,
    isPending,
    error,
  } = useQuery<AxiosResponse<ScriptProfile>, AxiosError<ApiError>>({
    queryKey: ["scriptProfiles", "single", params],
    queryFn: async ({ signal }) =>
      authFetch.get(`script-profiles/${params.id}`, { signal }),
    ...config,
  });

  return {
    scriptProfile: response?.data,
    scriptProfileError: error,
    isGettingScriptProfile: isPending,
  };
};
