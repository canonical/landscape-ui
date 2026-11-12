import { EXCLUDED_ACTIVITY_TYPE_OPTIONS } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { useMemo } from "react";
import { getStaffAccountPath } from "./helpers";

/** Gets the activity types an activity of the account named `name` can have. */
export const useGetStaffActivityTypes = (name: string) => {
  const authFetch = useFetch();

  const { data: response, isPending } = useQuery<
    AxiosResponse<string[]>,
    AxiosError<ApiError>
  >({
    queryKey: ["staffActivityTypes", name],
    queryFn: async () =>
      authFetch.get(getStaffAccountPath(name, "activity-types")),
    enabled: !!name,
  });

  const staffActivityTypes = useMemo(
    () =>
      response?.data.filter(
        (type) => !EXCLUDED_ACTIVITY_TYPE_OPTIONS.includes(type),
      ) ?? [],
    [response],
  );

  return {
    staffActivityTypes,
    isGettingStaffActivityTypes: isPending,
  };
};
