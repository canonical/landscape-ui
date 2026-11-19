import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { historyWindow } from "../history";
import type { ComputerHealthHistory, HealthHistoryRange } from "../types";

const FIVE_MINUTES = 300_000;

/** Returns the days on which an instance's result changed, with a baseline. */
export default function useComputerHealthHistory(
  computerId: number,
  days: HealthHistoryRange,
) {
  const authFetch = useFetch();
  const params = historyWindow(days);
  return useQuery<AxiosResponse<ComputerHealthHistory>, AxiosError<ApiError>>({
    queryKey: ["health", "history", "computer", computerId, params],
    queryFn: async () =>
      authFetch.get(`computers/${computerId}/health/history`, { params }),
    enabled: Number.isFinite(computerId) && computerId > 0,
    staleTime: FIVE_MINUTES,
  });
}
