import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { PackageChangePlanItem } from "../types/PackageChangePlanItem";

export interface ListPackageChangePlanItemsRequest {
  id: number;
  computer_ids?: number[];
  package_ids?: number[];
  computer_instance_name?: string;
  limit?: number;
  offset?: number;
}

export interface ListPackageChangePlanItemsResponse {
  items: PackageChangePlanItem[];
  count: number;
}

export default function useListPackageChangePlanItems(
  { id, ...params }: ListPackageChangePlanItemsRequest,
  options: Omit<
    UseQueryOptions<
      AxiosResponse<ListPackageChangePlanItemsResponse>,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetch = useFetch();

  return useQuery({
    queryKey: ["packageChangePlans", id, "items", params],
    queryFn: async () =>
      authFetch.get(`package-change-plans/${id}/items`, { params }),
    ...options,
  });
}
