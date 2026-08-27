import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ActivityStatus } from "@/features/activities";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export type UserProfileField =
  | "name"
  | "password"
  | "primary_group"
  | "location"
  | "home_phone"
  | "work_phone";

interface UserProfileActivityChange {
  kind: "profile";
  field: UserProfileField;
}

interface UserAdditionalGroupActivityChange {
  kind: "additional_group";
  group_name: string;
  operation: "add" | "remove";
}

export type UserActivityChange =
  | UserProfileActivityChange
  | UserAdditionalGroupActivityChange;

export interface UserActivityEvent {
  activity_id: number;
  summary: string;
  activity_status: ActivityStatus;
  changes: UserActivityChange[];
  completion_time: string | null;
  creation_time: string;
}

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

  const {
    data: response,
    isPending,
    isFetching,
    error,
    refetch,
  } = useQuery<AxiosResponse<UserActivitiesResponse>, AxiosError<ApiError>>({
    queryKey: ["userActivities", params.computer_id, params.username],
    queryFn: async () =>
      authFetch.get(
        `computers/${params.computer_id}/users/${params.username}/activities`,
      ),
  });

  return {
    userActivities: response?.data?.results ?? [],
    isLoadingUserActivities: isPending,
    isFetchingUserActivities: isFetching,
    userActivitiesError: error,
    refetchUserActivities: refetch,
  };
};
