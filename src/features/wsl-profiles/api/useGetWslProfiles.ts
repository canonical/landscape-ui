import useFetch from "@/hooks/useFetch";
import usePageParams from "@/hooks/usePageParams";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { PaginatedGetHookParams } from "@/types/api/PaginatedGetHookParams";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { WslProfile } from "../types";

interface GetWslProfilesParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export const useGetWslProfiles = (
  params?: GetWslProfilesParams,
  config?: PaginatedGetHookParams,
) => {
  const authFetch = useFetch();
  const { currentPage, pageSize } = usePageParams();

  params =
    (config?.listenToUrlParams ?? true)
      ? {
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
          ...params,
        }
      : params;

  const { data: response, isPending } = useQuery<
    AxiosResponse<ApiPaginatedResponse<WslProfile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["wslProfiles", params],
    queryFn: async () => authFetch.get("child-instance-profiles", { params }),
  });

  return {
    wslProfiles: response?.data.results ?? [],
    wslProfilesCount: response?.data.count ?? 0,
    isGettingWslProfiles: isPending,
  };
};
