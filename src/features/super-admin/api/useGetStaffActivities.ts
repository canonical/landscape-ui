import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { getStaffAccountPath } from "./helpers";

export interface GetStaffActivitiesParams {
  query?: string;
  limit?: number;
  offset?: number;
}

const EMPTY_ACTIVITIES: Activity[] = [];

/** Gets a page of the activities of the account named `name`. */
export const useGetStaffActivities = (
  name: string,
  params: GetStaffActivitiesParams = {},
) => {
  const authFetch = useFetch();

  const {
    data: response,
    isPending,
    error,
  } = useQuery<
    AxiosResponse<ApiPaginatedResponse<Activity>>,
    AxiosError<ApiError>
  >({
    queryKey: ["staffActivities", name, params],
    queryFn: async () =>
      authFetch.get(getStaffAccountPath(name, "activities"), { params }),
    enabled: !!name,
  });

  return {
    staffActivities: response?.data.results ?? EMPTY_ACTIVITIES,
    staffActivitiesCount: response?.data.count,
    staffActivitiesError: error,
    isGettingStaffActivities: isPending,
  };
};
