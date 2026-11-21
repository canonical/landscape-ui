import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { Instance } from "@/types/Instance";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { getStaffAccountPath } from "./helpers";

export interface GetStaffInstanceParams {
  instanceId: number;
  with_annotations?: boolean;
  with_grouped_hardware?: boolean;
  with_hardware?: boolean;
  with_network?: boolean;
  with_profiles?: boolean;
  with_alerts?: boolean;
}

/** Gets one instance of the account named `name`. */
export const useGetStaffInstance = (
  name: string,
  { instanceId, ...params }: GetStaffInstanceParams,
) => {
  const authFetch = useFetch();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery<AxiosResponse<Instance | null>, AxiosError<ApiError>>({
    queryKey: ["staffInstance", name, instanceId, params],
    queryFn: async () =>
      authFetch.get(getStaffAccountPath(name, `computers/${instanceId}`), {
        params,
      }),
    enabled: !!name && Number.isInteger(instanceId),
  });

  return {
    staffInstance: response?.data ?? undefined,
    staffInstanceError: error,
    isGettingStaffInstance: isLoading,
  };
};
