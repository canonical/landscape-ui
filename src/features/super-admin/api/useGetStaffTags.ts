import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { getStaffAccountPath } from "./helpers";

/** Gets the instance tags of the account named `name`. */
export const useGetStaffTags = (name: string) => {
  const authFetch = useFetch();

  const { data: response, isPending } = useQuery<
    AxiosResponse<ApiPaginatedResponse<string>>,
    AxiosError<ApiError>
  >({
    queryKey: ["staffTags", name],
    queryFn: async () => authFetch.get(getStaffAccountPath(name, "tags")),
    enabled: !!name,
  });

  return {
    staffTags: response?.data.results ?? [],
    isGettingStaffTags: isPending,
  };
};
