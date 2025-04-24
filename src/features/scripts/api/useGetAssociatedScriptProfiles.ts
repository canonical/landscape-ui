import type { ScriptProfile } from "@/features/script-profiles";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export const useGetAssociatedScriptProfiles = (
  scriptId: number,
  config: {
    enabled?: boolean;
  } = { enabled: true },
) => {
  const authFetch = useFetch();

  const { data: response, isPending } = useQuery<
    AxiosResponse<ApiPaginatedResponse<ScriptProfile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["scripts", "profiles", scriptId],
    queryFn: async () => authFetch.get(`scripts/${scriptId}/script-profiles`),
    ...config,
  });

  return {
    associatedScriptProfiles: response?.data.results ?? [],
    isAssociatedScriptProfilesLoading: isPending,
  };
};
