import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface GetScriptProfileLimitsResponse {
  max_num_computers: number;
  max_num_profiles: number;
  min_interval: number;
}

export const useGetScriptProfileLimits = () => {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<GetScriptProfileLimitsResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["scriptProfileLimits"],
    queryFn: async () => authFetch.get("script-profile-limits"),
  });

  return {
    scriptProfileLimits: response?.data,
    isGettingScriptProfileLimits: isLoading,
  };
};
