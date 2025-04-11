import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { QueryFnType } from "@/types/QueryFnType";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { AlertSummaryResponse } from "../types";

export default function useAlertsSummary() {
  const authFetch = useFetch();

  const getAlertsSummaryQuery: QueryFnType<
    AxiosResponse<AlertSummaryResponse>,
    undefined
  > = () =>
    useQuery<AxiosResponse<AlertSummaryResponse>, AxiosError<ApiError>>({
      queryKey: ["alert", "summary"],
      queryFn: () => authFetch.get("alerts/summary"),
    });

  return { getAlertsSummaryQuery };
}
