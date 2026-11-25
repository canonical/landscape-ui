import type { GetUsnsParams } from "@/features/usns";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { Usn } from "@/types/Usn";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { getStaffAccountPath } from "./helpers";

const EMPTY_USNS: Usn[] = [];

/** Gets a page of the security issues of instances of the account named `name`. */
export const useGetStaffUsns = (
  name: string,
  params: GetUsnsParams,
  { enabled = true }: { enabled?: boolean } = {},
) => {
  const authFetch = useFetch();

  const searchParams = { ...params, search: params.search || undefined };

  const {
    data: response,
    isLoading,
    error,
  } = useQuery<AxiosResponse<ApiPaginatedResponse<Usn>>, AxiosError<ApiError>>({
    queryKey: ["staffUsns", name, searchParams],
    queryFn: async () =>
      authFetch.get(getStaffAccountPath(name, "usns"), {
        params: searchParams,
      }),
    enabled: enabled && !!name && params.computer_ids.every(Number.isInteger),
  });

  return {
    staffUsns: response?.data.results ?? EMPTY_USNS,
    staffUsnsCount: response?.data.count,
    staffUsnsError: error,
    isGettingStaffUsns: isLoading,
  };
};
