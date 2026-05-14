import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { RemovalProfile } from "../types";

export function useGetRemovalProfile(
  id: number,
  config: Omit<
    UseQueryOptions<AxiosResponse<RemovalProfile[]>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetchOld = useFetchOld();

  const {
    data: response,
    isPending,
    error,
  } = useQuery<AxiosResponse<RemovalProfile[]>, AxiosError<ApiError>>({
    queryKey: ["removalProfile", id],
    queryFn: async ({ signal }) =>
      authFetchOld.get("GetRemovalProfiles", { signal }),
    ...config,
  });

  const removalProfile = response?.data.find(
    ({ id: removalProfileId }) => removalProfileId === id,
  );

  return {
    removalProfile,
    removalProfileError:
      response && !removalProfile
        ? new Error("The removal profile could not be found.")
        : error,
    isGettingRemovalProfile: isPending,
  };
}
