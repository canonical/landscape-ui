import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { HttpStatusCode, isAxiosError } from "axios";
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
    UserActivitiesResponse,
    AxiosError<ApiError>
  >({
    queryKey: ["userActivities", params.computer_id, params.username],
    queryFn: async () => {
      try {
        const { data } = await authFetch.get<UserActivitiesResponse>(
          `computers/${params.computer_id}/users/${params.username}/pending-activities`,
        );
        return data;
      } catch (error) {
        if (
          isAxiosError(error) &&
          error.response?.status === HttpStatusCode.Forbidden
        ) {
          return { count: 0, results: [] };
        }

        throw error;
      }
    },
  });

  return {
    userActivities: response?.results ?? [],
    isFetchingUserActivities: isFetching,
  };
};
