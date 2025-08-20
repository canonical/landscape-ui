import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { RebootProfile } from "../types";

interface UseGetRebootProfileParams {
  id: number;
}

export default function useGetRebootProfile(
  params: UseGetRebootProfileParams,
  config: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<RebootProfile>, AxiosError<ApiError>>
    >,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetch = useFetch();

  const {
    data: response,
    isPending,
    error,
  } = useQuery<
    AxiosResponse<ApiPaginatedResponse<RebootProfile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["rebootprofile", params.id],
    queryFn: async ({ signal }) => authFetch.get("rebootprofiles", { signal }),
    ...config,
  });

  const rebootProfile = response?.data.results.find(
    ({ id }) => id === params.id,
  );

  return {
    rebootProfile,
    rebootProfileError:
      response && !rebootProfile
        ? new Error("The reboot profile could not be found.")
        : error,
    isGettingRebootProfile: isPending,
  };
}
