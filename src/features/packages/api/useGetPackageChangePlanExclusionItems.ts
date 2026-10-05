import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { PackageChangePlanActionType } from "../types";

export interface GetPackageChangePlanExclusionItemsRequest {
  id: number;
  package_name: string;
  computer_ids?: number[];
  computer_instance_name?: string;
}

export interface GetPackageChangePlanExclusionItemsResponse {
  action: PackageChangePlanActionType;
  package_name: string;
  computers: { id: number; name: string }[];
}

export default function useGetPackageChangePlanExclusionItems(
  { id, package_name, ...params }: GetPackageChangePlanExclusionItemsRequest,
  options: Omit<
    UseQueryOptions<
      AxiosResponse<GetPackageChangePlanExclusionItemsResponse>,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetch = useFetch();

  return useQuery({
    queryKey: ["packageChangePlans", id, "exclusions", package_name, params],
    queryFn: async () =>
      authFetch.get(
        `package-change-plans/${id}/exclusions/${encodeURIComponent(package_name)}`,
        {
          params,
        },
      ),
    ...options,
  });
}
