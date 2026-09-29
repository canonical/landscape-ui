import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { PackageChangePlanItem } from "../types/PackageChangePlanItem";
import type { PackageChangePlanAction } from "../types";

export interface ListPackageChangePlanItemsRequest {
  id: number;
  computer_ids?: number[];
  computer_instance_name?: string;
  install?: number;
  remove?: number;
  hold?: number;
  unhold?: number;
  upgrade?: number;
  change_version?: {
    from_package_id: number;
    to_package_id: number;
  };
  limit?: number;
  offset?: number;
}

export interface ListPackageChangePlanItemsResponse {
  action: PackageChangePlanAction;
  items: PackageChangePlanItem[];
  count: number;
  next: string;
  previous: string;
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
