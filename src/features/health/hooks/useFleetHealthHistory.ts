import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { historyWindow } from "../history";
import type {
  FleetHealthHistoryRow,
  HealthHistoryRange,
  HealthHistoryResponse,
} from "../types";

const FIVE_MINUTES = 300_000;

/** Returns the daily fleet history for the last `days` days. */
export default function useFleetHealthHistory(days: HealthHistoryRange) {
  const authFetch = useFetch();
  const params = historyWindow(days);
  return useQuery<
    AxiosResponse<HealthHistoryResponse<FleetHealthHistoryRow>>,
    AxiosError<ApiError>
  >({
    queryKey: ["health", "history", "fleet", params],
    queryFn: async () => authFetch.get("health/history", { params }),
    // Written once a night, so there is nothing to gain from refetching.
    staleTime: FIVE_MINUTES,
  });
}
