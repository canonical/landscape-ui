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

  return {
    alertsSummary: data?.data.alerts_summary ?? [],
    isGettingAlertsSummary: isPending,
  };
}
