import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { EXCLUDED_ACTIVITY_TYPE_OPTIONS } from "../constants";

const useGetActivityTypes = (
  options: Omit<
    UseQueryOptions<AxiosResponse<string[]>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetchOld = useFetchOld();

  const { data: response, isPending } = useQuery<
    AxiosResponse<string[]>,
    AxiosError<ApiError>
  >({
    queryKey: ["activityTypes"],
    queryFn: async () => authFetchOld.get("GetActivityTypes"),
    ...options,
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
