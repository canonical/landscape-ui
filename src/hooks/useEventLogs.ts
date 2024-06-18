import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "@/types/ApiError";
import { EventLog } from "@/types/EventLogs";
import useFetch from "./useFetch";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { QueryFnType } from "@/types/QueryFnType";

export interface GetEventsLogParams {
  days: number;
  limit: number;
  offset: number;
  search?: string;
}

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
        authFetch!.get("events", {
          params: queryParams,
        }),
      ...config,
    });

  return {
    getEventsLog,
  };
}
