import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UsnPackage } from "@/types/Usn";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { getStaffAccountPath } from "./helpers";

const EMPTY_USN_PACKAGES: UsnPackage[] = [];

/** Gets the packages of `computerIds` that the security issue `usn` affects, in the account named `name`. */
export const useGetStaffUsnPackages = (
  name: string,
  usn: string,
  computerIds: number[],
) => {
  const authFetch = useFetch();

  const params = { computer_ids: computerIds };

  const {
    data: response,
    isLoading,
    error,
  } = useQuery<AxiosResponse<UsnPackage[]>, AxiosError<ApiError>>({
    queryKey: ["staffUsnPackages", name, usn, params],
    queryFn: async () =>
      authFetch.get(
        getStaffAccountPath(name, `usns/${encodeURIComponent(usn)}`),
        { params },
      ),
    enabled: !!name && !!usn && computerIds.every(Number.isInteger),
  });

  return {
    staffUsnPackages: response?.data ?? EMPTY_USN_PACKAGES,
    staffUsnPackagesError: error,
    isGettingStaffUsnPackages: isLoading,
  };
};
