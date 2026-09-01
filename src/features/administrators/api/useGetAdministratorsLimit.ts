import type { ApiError } from "@/types/api/ApiError";
import useFetch from "@/hooks/useFetch";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface MaxPeopleCountResponse {
  max_people_count: number;
}

export const useGetAdministratorsLimit = (
  options: Omit<
    UseQueryOptions<
      AxiosResponse<MaxPeopleCountResponse>,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();

  const { data, isPending } = useQuery<
    AxiosResponse<MaxPeopleCountResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["admin-limit"],
    queryFn: async () => authFetch.get("max-people-count"),
    ...options,
  });

  return {
    administratorsLimit: data?.data.max_people_count ?? 0,
    isGettingAdministratorsLimit: isPending,
  };
};
