import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { StaffPeopleResult, StaffPeopleResultType } from "../types";

/** The shortest search the server accepts. */
const STAFF_PEOPLE_SEARCH_MIN_LENGTH = 3;

export interface GetStaffPeopleParams {
  search: string;
  type?: StaffPeopleResultType;
  limit?: number;
  offset?: number;
}

/** Searches people and pending invitations; idle until `search` is long enough. */
export const useGetStaffPeople = (
  params: GetStaffPeopleParams,
  options: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<StaffPeopleResult>>,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn" | "enabled"
  > = {},
) => {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<ApiPaginatedResponse<StaffPeopleResult>>,
    AxiosError<ApiError>
  >({
    queryKey: ["staffPeople", params],
    queryFn: async () => authFetch.get("people", { params }),
    enabled: params.search.length >= STAFF_PEOPLE_SEARCH_MIN_LENGTH,
    ...options,
  });

  return {
    staffPeople: response?.data.results ?? [],
    staffPeopleCount: response?.data.count ?? 0,
    isGettingStaffPeople: isLoading,
  };
};
