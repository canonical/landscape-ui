import useFetch from "@/hooks/useFetch";
import { ApiError } from "@/types/ApiError";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { QueryFnType } from "@/types/QueryFnType";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { EventLog, GetEventsLogParams } from "../types";

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
