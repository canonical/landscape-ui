import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { getStaffAccountPath } from "./helpers";

/** Gets the availability zones of the instances of the account named `name`. */
export const useGetStaffAvailabilityZones = (name: string) => {
  const authFetch = useFetch();

  const { data: response, isPending } = useQuery<
    AxiosResponse<{ values: string[] }>,
    AxiosError<ApiError>
  >({
    queryKey: ["staffAvailabilityZones", name],
    queryFn: async () =>
      authFetch.get(getStaffAccountPath(name, "computers/availability-zones")),
    enabled: !!name,
  });

  return {
    staffAvailabilityZones: response?.data.values ?? [],
    isGettingStaffAvailabilityZones: isPending,
  };
};
