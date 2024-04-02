import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "@/types/ApiError";
import { EventLog } from "@/types/EventLogs";
import useFetch from "./useFetch";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { QueryFnType } from "@/types/QueryFnType";

interface GetEventLogsParams {
  days: number;
  limit: number;
  offset: number;
  search?: string;
}

export default function useEventLogs() {
  const authFetch = useFetch();

  const getEventLogs: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<EventLog>>,
    GetEventLogsParams
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
    getEventLogs,
  };
}
