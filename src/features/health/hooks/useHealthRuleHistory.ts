import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { historyWindow } from "../history";
import type {
  HealthHistoryRange,
  HealthHistoryResponse,
  HealthRuleHistoryRow,
} from "../types";

const FIVE_MINUTES = 300_000;

/** Returns the daily per-rule history for the last `days` days. */
export default function useHealthRuleHistory(days: HealthHistoryRange) {
  const authFetch = useFetch();
  const params = historyWindow(days);
  return useQuery<
    AxiosResponse<HealthHistoryResponse<HealthRuleHistoryRow>>,
    AxiosError<ApiError>
  >({
    queryKey: ["health", "history", "rules", params],
    queryFn: async () => authFetch.get("health/history/rules", { params }),
    staleTime: FIVE_MINUTES,
  });
}
