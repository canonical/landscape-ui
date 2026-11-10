import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { Instance } from "@/types/Instance";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { getStaffAccountPath } from "./helpers";

export interface GetStaffInstancesParams {
  query?: string;
  archived_only?: boolean;
  wsl_children?: boolean;
  wsl_parents?: boolean;
  with_alerts?: boolean;
  with_upgrades?: boolean;
  with_release_upgrades?: boolean;
  limit?: number;
  offset?: number;
}

/** Gets a page of the instances of the account named `name`. */
export const useGetStaffInstances = (
  name: string,
  params: GetStaffInstancesParams = {},
) => {
  const authFetch = useFetch();

  const {
    data: response,
    isPending,
    error,
  } = useQuery<
    AxiosResponse<ApiPaginatedResponse<Instance>>,
    AxiosError<ApiError>
  >({
    queryKey: ["staffInstances", name, params],
    queryFn: async () =>
      authFetch.get(getStaffAccountPath(name, "computers"), {
        params: { ...params, root_only: false },
      }),
    enabled: !!name,
  });

  return {
    staffInstances: response?.data.results ?? [],
    staffInstancesCount: response?.data.count,
    staffInstancesError: error,
    isGettingStaffInstances: isPending,
  };
};
