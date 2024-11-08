import useFetch from "@/hooks/useFetch";
import { ApiError } from "@/types/ApiError";
import { QueryFnType } from "@/types/QueryFnType";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { AlertSummaryResponse } from "../types";

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
