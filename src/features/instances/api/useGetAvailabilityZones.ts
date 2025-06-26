import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export const useGetAvailabilityZones = () => {
  const authFetch = useFetch();

  const { data: response, isPending } = useQuery<
    AxiosResponse<{ values: string[] }>,
    AxiosError<ApiError>
  >({
    queryKey: ["availabilityZones"],
    queryFn: async () => authFetch.get("computers/availability-zones"),
  });

  return {
    availabilityZones: response?.data.values ?? [],
    isGettingAvailabilityZones: isPending,
  };
};
