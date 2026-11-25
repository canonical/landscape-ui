import type {
  ComputerPackageSearchGroupedResponse,
  ComputerPackageSearchParams,
  InstancePackage,
} from "@/features/packages";
import { mapGroupedResultToInstancePackage } from "@/features/packages";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getStaffAccountPath } from "./helpers";

export type GetStaffInstancePackagesParams = Omit<
  ComputerPackageSearchParams,
  "group_by_name"
>;

const EMPTY_PACKAGES: InstancePackage[] = [];

/** Gets a page of the packages of an instance of the account named `name`. */
export const useGetStaffInstancePackages = (
  name: string,
  instanceId: number,
  params: GetStaffInstancePackagesParams = {},
  { enabled = true }: { enabled?: boolean } = {},
) => {
  const authFetch = useFetch();

  const searchParams = {
    ...params,
    search: params.search || undefined,
    group_by_name: true,
  };

  const { data, isLoading, error } = useQuery<
    { results: InstancePackage[]; count: number },
    AxiosError<ApiError>
  >({
    queryKey: ["staffInstancePackages", name, instanceId, searchParams],
    queryFn: async () => {
      const { data: response } =
        await authFetch.get<ComputerPackageSearchGroupedResponse>(
          getStaffAccountPath(name, `computers/${instanceId}/packages/search`),
          { params: searchParams },
        );

      return {
        results: response.results.map(mapGroupedResultToInstancePackage),
        count: response.count,
      };
    },
    enabled: enabled && !!name && Number.isInteger(instanceId),
  });

  return {
    staffInstancePackages: data?.results ?? EMPTY_PACKAGES,
    staffInstancePackagesCount: data?.count,
    staffInstancePackagesError: error,
    isGettingStaffInstancePackages: isLoading,
  };
};
