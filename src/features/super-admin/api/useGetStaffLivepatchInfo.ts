import type { LivepatchInformation } from "@/features/kernel";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { getStaffAccountPath } from "./helpers";

/** Gets the Livepatch information of an instance of the account named `name`. */
export const useGetStaffLivepatchInfo = (
  name: string,
  instanceId: number,
  { enabled = true }: { enabled?: boolean } = {},
) => {
  const authFetch = useFetch();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery<AxiosResponse<LivepatchInformation>, AxiosError<ApiError>>({
    queryKey: ["staffLivepatchInfo", name, instanceId],
    queryFn: async () =>
      authFetch.get(
        getStaffAccountPath(name, `computers/${instanceId}/livepatch/info`),
      ),
    enabled: enabled && !!name && Number.isInteger(instanceId),
  });

  return {
    staffLivepatchInfo: response?.data,
    isGettingStaffLivepatchInfo: isLoading,
    staffLivepatchInfoError: error,
  };
};
