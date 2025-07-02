import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface GetScriptProfileActivitiesParams {
  id: number;
  limit: number;
  offset: number;
}

export const useGetScriptProfileActivities = ({
  id,
  ...params
}: GetScriptProfileActivitiesParams) => {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<ApiPaginatedResponse<Activity>>,
    AxiosError<ApiError>
  >({
    queryKey: ["scriptProfileActivities", { id, ...params }],
    queryFn: async () =>
      authFetch.get(`script-profiles/${id}/activities`, { params }),
  });

  return {
    activities: response?.data.results ?? [],
    activitiesCount: response?.data.count,
    isGettingActivities: isLoading,
  };
};
