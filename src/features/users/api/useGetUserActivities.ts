import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { UserActivityEvent } from "../types";

interface GetUserActivitiesParams {
  computer_id: number;
  username: string;
}

interface UserActivitiesResponse {
  count: number;
  results: UserActivityEvent[];
}

export const useGetUserActivities = (params: GetUserActivitiesParams) => {
  const authFetch = useFetch();

  const { data: response, isFetching } = useQuery<
    AxiosResponse<UserActivitiesResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["userActivities", params.computer_id, params.username],
    queryFn: async () =>
      authFetch.get(
        `computers/${params.computer_id}/users/${params.username}/pending-activities`,
      ),
  });

  return {
    userActivities: response?.data?.results ?? [],
    isFetchingUserActivities: isFetching,
  };
};
