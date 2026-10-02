import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { GroupsResponse } from "@/types/User";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface GetGroupsParams {
  computer_id: number;
}

export const useGetGroups = (params: GetGroupsParams) => {
  const authFetch = useFetch();

  const {
    data: response,
    isPending,
    isFetching,
    error,
    refetch,
  } = useQuery<AxiosResponse<GroupsResponse>, AxiosError<ApiError>>({
    queryKey: ["groups", params.computer_id],
    queryFn: async () =>
      authFetch.get(`computers/${params.computer_id}/groups`),
  });

  return {
    groups: response?.data?.groups ?? [],
    isLoadingGroups: isPending,
    isFetchingGroups: isFetching,
    groupsError: error,
    refetchGroups: refetch,
  };
};
