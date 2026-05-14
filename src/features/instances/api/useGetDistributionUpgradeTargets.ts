import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { DistributionUpgradeTarget } from "@/features/instances";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface DistributionUpgradeTargetsResponse {
  results: DistributionUpgradeTarget[];
}

export const useGetDistributionUpgradeTargets = (
  computerIds: number[],
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<DistributionUpgradeTargetsResponse>,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  const authFetch = useFetch();
  const idsParam = computerIds.join(",");

  const { data: response, isFetching } = useQuery<
    AxiosResponse<DistributionUpgradeTargetsResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["distributionUpgradeTargets", computerIds],
    queryFn: async () =>
      authFetch.get("computers/release-upgrade-targets", {
        params: { computer_ids: idsParam },
      }),
    ...options,
  });

  return {
    distributionUpgradeTargets: response?.data.results ?? [],
    isGettingDistributionUpgradeTargets: isFetching,
  };
};
