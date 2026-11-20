import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { getStaffAccountPath } from "./helpers";

/** Gets one activity of the account named `name`. */
export const useGetStaffActivity = (name: string, activityId: number) => {
  const authFetch = useFetch();

  const {
    data: response,
    isPending,
    error,
  } = useQuery<AxiosResponse<Activity>, AxiosError<ApiError>>({
    queryKey: ["staffActivity", name, activityId],
    queryFn: async () =>
      authFetch.get(getStaffAccountPath(name, `activities/${activityId}`)),
    enabled: !!name,
  });

  return {
    staffActivity: response?.data,
    staffActivityError: error,
    isGettingStaffActivity: isPending,
  };
};
