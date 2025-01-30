import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import type { QueryFnType } from "@/types/QueryFnType";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { EventLog, GetEventsLogParams } from "../types";

export default function useEventsLog() {
  const authFetch = useFetch();

  const getEventsLog: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<EventLog>>,
    GetEventsLogParams
  > = (queryParams, config = {}) =>
    useQuery<
      AxiosResponse<ApiPaginatedResponse<EventLog>>,
      AxiosError<ApiError>
    >({
      queryKey: ["events", queryParams],
      queryFn: () =>
        authFetch.get("events", {
          params: queryParams,
        }),
      ...config,
    });

  return {
    getEventsLog,
  };
}
