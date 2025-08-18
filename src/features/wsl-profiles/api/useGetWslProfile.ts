import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { WslProfile } from "../types";

interface GetWslProfileParams {
  profile_name: string;
}

export const useGetWslProfile = (
  { profile_name }: GetWslProfileParams,
  config: Omit<
    UseQueryOptions<AxiosResponse<WslProfile, AxiosError<ApiError>>>,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();

  const {
    data: response,
    isPending,
    error,
  } = useQuery<AxiosResponse<WslProfile>, AxiosError<ApiError>>({
    queryKey: ["wslProfiles", profile_name],
    queryFn: async () =>
      authFetch.get(`child-instance-profiles/${profile_name}`),
    ...config,
  });

  return {
    wslProfile: response?.data,
    wslProfileError: error,
    isGettingWslProfile: isPending,
  };
};
