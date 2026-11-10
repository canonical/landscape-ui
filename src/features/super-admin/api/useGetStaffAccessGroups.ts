import type { AccessGroup } from "@/features/access-groups";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { getStaffAccountPath } from "./helpers";

/** Gets the access groups of the account named `name`. */
export const useGetStaffAccessGroups = (name: string) => {
  const authFetch = useFetch();

  const { data: response, isPending } = useQuery<
    AxiosResponse<AccessGroup[]>,
    AxiosError<ApiError>
  >({
    queryKey: ["staffAccessGroups", name],
    queryFn: async () =>
      authFetch.get(getStaffAccountPath(name, "access-groups")),
    enabled: !!name,
  });

  return {
    staffAccessGroups: response?.data ?? [],
    isGettingStaffAccessGroups: isPending,
  };
};
