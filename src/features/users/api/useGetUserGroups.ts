import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { GroupsResponse } from "@/types/User";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface GetUserGroupsParams {
  computer_id: number;
  username: string;
}

export const useGetUserGroups = (params: GetUserGroupsParams) => {
  const authFetch = useFetch();

  const {
    data: response,
    isPending,
    isFetching,
    error,
    refetch,
  } = useQuery<AxiosResponse<GroupsResponse>, AxiosError<ApiError>>({
    queryKey: ["userGroups", params.computer_id, params.username],
    queryFn: async () =>
      authFetch.get(
        `computers/${params.computer_id}/users/${params.username}/groups`,
      ),
  });

  return {
    userGroups: response?.data?.groups ?? [],
    isLoadingUserGroups: isPending,
    isFetchingUserGroups: isFetching,
    userGroupsError: error,
    refetchUserGroups: refetch,
  };
};
