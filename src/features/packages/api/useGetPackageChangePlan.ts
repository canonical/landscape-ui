import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { PackageChangePlan } from "../types/PackageChangePlan";

export default function useGetPackageChangePlan(
  id: number,
  options: Omit<
    UseQueryOptions<AxiosResponse<PackageChangePlan>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetch = useFetch();

  return useQuery<AxiosResponse<PackageChangePlan>, AxiosError<ApiError>>({
    queryKey: ["packageChangePlans", id],
    queryFn: async () => authFetch.get(`package-change-plans/${id}`),
    ...options,
  });
}
