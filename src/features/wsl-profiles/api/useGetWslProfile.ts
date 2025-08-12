import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { WslProfile } from "../types";

interface GetWslProfileParams {
  profile_name: string;
}

export const useGetWslProfile = ({ profile_name }: GetWslProfileParams) => {
  const authFetch = useFetch();

  const {
    data: response,
    isPending,
    error,
  } = useQuery<AxiosResponse<WslProfile>, AxiosError<ApiError>>({
    queryKey: ["wslProfiles", profile_name],
    queryFn: async () =>
      authFetch.get(`child-instance-profiles/${profile_name}`),
  });

  return {
    wslProfile: response?.data,
    wslProfileError: error,
    isGettingWslProfile: isPending,
  };
};
