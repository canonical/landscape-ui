import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { EXCLUDED_ACTIVITY_TYPE_OPTIONS } from "../constants";

const useGetActivityTypes = () => {
  const authFetchOld = useFetchOld();

  const { data: response, isPending } = useQuery<
    AxiosResponse<string[]>,
    AxiosError<ApiError>
  >({
    queryKey: ["activityTypes"],
    queryFn: async () => authFetchOld.get("GetActivityTypes"),
  });

  const filteredActivityTypes =
    response?.data.filter(
      (activityType) => !EXCLUDED_ACTIVITY_TYPE_OPTIONS.includes(activityType),
    ) ?? [];

  return {
    activityTypes: filteredActivityTypes,
    isGettingActivityTypes: isPending,
  };
};

export default useGetActivityTypes;
