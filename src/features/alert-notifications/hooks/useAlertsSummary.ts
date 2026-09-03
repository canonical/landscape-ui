import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { AlertSummaryResponse } from "../types";

export default function useAlertsSummary() {
  const authFetch = useFetch();

  const { data, isPending } = useQuery<
    AxiosResponse<AlertSummaryResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["alert", "summary"],
    queryFn: async () => authFetch.get("alerts/summary"),
  });

  const alerts = data?.data.alerts_summary ?? [];

  return {
    alertsSummary: alerts,
    alertsSummaryCount: alerts.length,
    isGettingAlertsSummary: isPending,
  };
}
