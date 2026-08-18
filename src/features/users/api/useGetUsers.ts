import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { User } from "@/types/User";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface GetUsersParams {
  computer_id: number;
  limit?: number;
  offset?: number;
  query?: string;
}

export const useGetUsers = (params: GetUsersParams) => {
  const authFetch = useFetch();

  const {
    data: response,
    isPending,
    isFetching,
    error,
    refetch,
  } = useQuery<AxiosResponse<ApiPaginatedResponse<User>>, AxiosError<ApiError>>(
    {
      queryKey: ["users", { ...params }],
      queryFn: async () => authFetch.get("users", { params }),
    },
  );

  return {
    users: response?.data?.results ?? [],
    usersCount: response?.data?.count,
    isLoadingUsers: isPending,
    isFetchingUsers: isFetching,
    usersError: error,
    refetchUsers: refetch,
  };
};
